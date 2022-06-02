const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../Models/User');
const totpmod = require("node-2fa");
const { forwardAuthenticated, ensureAuthenticated } = require('../Internals/AuthHelpers');
const config = require('../Configuration/API');

router.get('/forgot', forwardAuthenticated, (req, res) => res.render('forgot', { req }));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { req }));
router.get('/register', forwardAuthenticated, (req, res) => {
    let fuck = config.accessIDs.find(shit => shit.id == req.query.accessID);

    if (!req.query.accessID) res.render('register', { req });
    if (req.query.accessID && !fuck) {
        res.render('error', { req, error: 'You provided an invalid access ID. Please contact an Administrator' });
    } else if (req.query.accessID && fuck) res.render('register', { req, obj: fuck });
});

router.post('/login', (req, res, next) => {
    setTimeout(() => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        })(req, res, next);
    }, 500);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/register', async (req, res) => {
    const obj = config.accessIDs.find(shit => shit.id == req.query.accessID);
    const { password, password2 } = req.body;
    let errors = [];

    const username = obj.name;
    const email = obj.email;

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (username < 3 || username > 16) {
        errors.push({ msg: 'Username must be at least 3 characters and no longer than 16 characters.' });
    }

    if (errors.length > 0) {
        res.render('register', {
            req,
            errors
        });
    } else {
        User.findOne({ username }).then(async userA => {
            if (userA) {
                errors.push({ msg: 'Username already registered.' });
                res.render('register', { req, errors });
            } else {
                User.findOne({ email }).then(async userB => {
                    if (userB) {
                        errors.push({ msg: 'Email already registered.' });
                        res.render('register', { req, errors });
                    } else {
                        const newUser = new User({
                            username,
                            email,
                            password,
                            uuid: obj.unique
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(async ignored => {
                                        //req.flash('success_msg', 'You are now registered and can log in');
                                        res.redirect('/auth/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                }).catch(console.error);
            }
        }).catch(console.error);
    }
});

router.post('/password', ensureAuthenticated, async (req, res) => {
    if (req.body.current && req.body.new && req.body.new2) {
        bcrypt.compare(req.body.current, req.user.password, async (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                if (req.body.new !== req.body.new2) {
                    res.redirect('/settings');
                    return;
                }

                bcrypt.genSalt(10, async (err, salt) => {
                    await bcrypt.hash(req.body.new, salt, async (err, hash) => {
                        if (err) throw err;
                        User.updateOne({ uuid: req.user.uuid }, { password: hash }, async (shit1, shit2, shit3) => {
                            await res.redirect('/settings');
                        });
                    });
                });
            } else res.redirect('/settings');
        });
    } else res.send('bro wtf. ');
});

router.get("/2fa/generate", ensureAuthenticated, async (req, res) => {
    let userObj = await User.findOne({ uuid: req.user.uuid });
    const tfa = totpmod.generateSecret({ name: "MineRIP Website", account: userObj.uuid });
    res.send({ status: 200, response: { qr: tfa.qr, secret: tfa.secret } });
    return;
});

router.get("/2fa/validate", ensureAuthenticated, async (req, res) => {
    let userObj = await User.findOne({ uuid: req.user.uuid });
    console.log(userObj);
    if (!userObj.twoFactor) return res.status(400).send({ status: 400, response: "2FA is not enabled for this account." }); 
    if (!req.query.totpcode) return res.status(400).send({ status: 400, response: "No TOTP code provided" });
    const tokenValidation = totpmod.verifyToken(userObj.twoFactor, req.query.totpcode, 1);
    if (tokenValidation == null) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
    if (tokenValidation.delta !== 0) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
    res.status(200).send({ status: 200, response: "TOTP code is valid" });
    return;
});

router.get("/2fa/save", ensureAuthenticated, async (req, res) => {
    let userObj = await User.findOne({ uuid: req.user.uuid });
    if (!req.query.secret) return res.status(400).send({ status: 400, response: "No secret provided" });
    if (!req.query.totpcode) return res.status(400).send({ status: 400, response: "No TOTP code provided" });
    if (!userObj.twoFactor) {
        const tokenValidation = totpmod.verifyToken(req.query.secret, req.query.totpcode, 1);
        if (tokenValidation == null) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
        if (tokenValidation.delta !== 0) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
        userObj.twoFactor = req.query.secret;

        User.findOneAndUpdate({ uuid: req.user.uuid }, userObj, async (shit1, shit2, shit3) => {
            return res.status(200).send({ status: 200, response: "TOTP code valid, saving.." });
        });
        return;
    } else {
        if (!req.query.oldtotpcode) return res.status(400).send({ status: 400, response: "No old TOTP code provided" });
        const oldTokenValidation = totpmod.verifyToken(userObj.twoFactor.secret, req.query.oldtotpcode, 1);
        if (oldTokenValidation == null) return res.status(400).send({ status: 400, response: "Invalid old TOTP code" });
        if (oldTokenValidation.delta !== 0) return res.status(400).send({ status: 400, response: "Invalid old TOTP code" });
        const tokenValidation = totpmod.verifyToken(req.query.secret, req.query.totpcode, 1);
        if (tokenValidation == null) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
        if (tokenValidation.delta !== 0) return res.status(400).send({ status: 400, response: "Invalid TOTP code" });
        userObj.twoFactor = req.query.secret;

        User.updateOne({ uuid: req.user.uuid }, userObj, async (shit1, shit2, shit3) => {
            return res.status(200).send({ status: 200, response: "TOTP code valid, updating.." });
        });
        return;
    };
});



module.exports = router;