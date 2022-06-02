const express = require('express');
const router = express.Router();
const config = require('../Configuration/API.js');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const CUser = require('../Models/ClientUser');
const User = require('../Models/User');
const News = require('../Models/News');
const { ensureAuthenticated } = require('../Internals/AuthHelpers');

router.get('/v1/', async (req, res) => {
    res.send("This is the v1 API root. For API documentation, please refer to the \"docs\" folder.");
});

router.get('/v1/autocomplete', async (req, res) => {
    let usernames = [];
    let users = await User.find({});
    
    for (const user of users) {
        usernames.push(user.username);
    }
    
    res.json({ usernames });
});

router.post('/v1/access', async (req, res) => {
    if (req.query.auth && req.query.useremail && req.query.user && req.query.id) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const accessID = uuidv4();
            config.accessIDs.push({
                id: accessID.toString().toLowerCase(),
                name: req.query.user,
                email: req.query.useremail,
                unique: req.query.id
            });
            
            async function handleMail() {
                let transporter = nodemailer.createTransport({
                    host: "mx.dannington.systems",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: config.email.address,
                        pass: config.email.password,
                    },
                });
                
                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"MineRIP Network" <registration@mine.rip>', // sender address
                    to: req.query.useremail, // list of receivers
                    subject: "Confirm your account", // Subject line
                    text: "Confirm your MineRIP account to gain access to tickets and perks.", // plain text body
                    html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns=3D"http://www.w3.org/1999/xhtml"><head>
                <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=3D1.0" />
                <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8=" />
                <style type=3D"text/css" rel=3D"stylesheet" media=3D"all">@media only screen and (max-width: 600px) {.email-body_inner,.email-footer{width:100% !important;}}@media only screen and (max-width: 500px) {.button{width:100% !important;}}

                 </style>
                 </head>
                 <body style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; height: 100%; margin: 0; line-height: 1.4; background-color: #F2F4F6; color: #74787E; -webkit-text-size-adjust: none; width: 100% !important;">
                 <table class=3D"email-wrapper" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F2F4F6;" width=3D"100%" cellpadding=3D"0" cellspacing=3D"0">
                 <tbody style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box;">
                 <tr>
                    <td style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;" align=3D"center">
                    <table class=3D"email-content" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;" width=3D"100%" cellpadding=3D"0" cellspacing=3D"0">
                    <tbody style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box;">
                 <tr>
                    <td class=3D"email-masthead" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 25px 0; text-align: center;">
                    <a class=3D"email-masthead_name" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; color: #BBBFC3; font-size: 16px; font-weight: bold; text-decoration: none; text-shadow: 0 1px 0 white;" href>MineRIP
                    </a>
                 <tr>
                    <td class=3D"email-body" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;
                     width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0; border-top: 1px solid #EDEFF2; border-bottom: 1px solid #EDEFF2; background-color: #FFF;" width=3D"100%" cellpadding=3D"0" cellspacing=3D"0">
                    <table class=3D"email-body_inner" style=3D"font-family: Arial,
                    'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; width: 570px; 
                    margin: 0 auto; padding: 0; -premailer-width: 570px;
                     -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFF;" align=3D"center" width=3D"570" cellpadding=3D"0" cellspacing=3D"0">
                    <tbody style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box;">
                 <tr>
                    <td class=3D"content-cell" style=3D"font-family: Arial, 'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 35px;", style="width: 412px;">

                    <h1 style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; margin-top: 0; color: #2F3133; font-size: 19px; font-weight: bold; text-align: left;">Hey,</h1>
                    <p style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">Thanks for registering for an account at https://mine.rip! Please confirm your email to continue:
                    </p>
                    <!-- Border based button https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                    <a href="https://mine.rip/auth/register?accessID=${accessID}" style="background-color: #1F7F4C; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 14px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;">
                    <!--[if mso]>
                    <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
                    <![endif]-->
                    <span style="mso-text-raise: 15pt;">Confirm Account &rarr;</span>
                    <!--[if mso]>
                    <i style="letter-spacing: 25px; mso-font-width: -100%;">&nbsp;</i>
                    <![endif]-->
                </a>
                    </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 </tbody></table>
                 <p style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">
                 If you did not sign up for an account, you can simply ignore this email</p>
                 <p style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">Thanks,
                 <br />The team at MineRIP</p>
                 <!-- Sub copy -->
                 <table class=3D"body-sub" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; margin-top: 25px; padding-top: 25px; border-top: 1px solid #EDEFF2;">
                 <tbody style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box;">
                 <tr>
                    <td style=3D"font-family: Arial,'Helvetica Neue', Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">
                    <p class=3D"sub" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 12px;">If
                    you&#8217;re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                    <p class=3D"sub" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 12px;">https://mine.rip/auth/register?accessID=${accessID}</p>
                    </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 <tr>
                    <td style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">
                    <table class=3D"email-footer" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center;" align=3D"center" width=3D"570" cellpadding=3D"0" cellspacing=3D"0">
                    <tbody style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box;">
                 <tr>
                    <td class=3D"content-cell" style=3D"font-family: Arial, 'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 35px;" align=3D"center">
                    <p class=3D"sub align-center" style=3D"font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: center; margin-top: 0; color: #AEAEAE; font-size: 12px;">&#169; 2021 OrbitGames LLC</p>
                    </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 </tbody></table>
                 </td>
                 </tr>
                 </tbody></table>                    `, // html body
                });
                
                console.log("Message sent: %s", info.messageId);
            }
            
            handleMail().catch(async err => {
                await console.error(err);
                await res.send('failure');
            }).then(async () => {
                await res.send('success');
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/userExist', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            res.send(exists ? 'exists' : 'notexists');
            
            console.log(exists);
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/emailExist', async (req, res) => {
    if (req.query.auth && req.query.useremail) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ useremail: req.query.useremail });
            res.send(exists ? 'exists' : 'notexists');
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/updateLogin', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { lastLogin: Date.now() }, async (shit1, shit2, shit3) => {
                await res.send('pxgchamp');
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/updateServer', async (req, res) => {
    if (req.query.auth && req.query.uuid && req.query.server) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { lastServer: req.query.server }, async (shit1, shit2, shit3) => {
                await res.send('Updated last online server for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/online', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { online: true }, async (shit1, shit2, shit3) => {
                await res.send('Updated online status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/offline', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { online: false }, async (shit1, shit2, shit3) => {
                await res.send('Updated online status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/banned', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { banned: true }, async (shit1, shit2, shit3) => {
                await res.send('Updated banned status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/blacklisted', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { blacklisted: true }, async (shit1, shit2, shit3) => {
                await res.send('Updated blacklisted status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/unbanned', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { banned: false }, async (shit1, shit2, shit3) => {
                await res.send('Updated banned status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/unblacklisted', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }
            
            User.updateOne({ uuid: req.query.uuid }, { blacklisted: false }, async (shit1, shit2, shit3) => {
                await res.send('Updated blacklisted status for ' + req.query.uuid);
            });
        } else res.status(403).send("Unauthorized");
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/connections', ensureAuthenticated, async (req, res) => {
    const { reddit, twitter, twitch, youtube, github } = req.body;
    
    if ((twitch.length > 0 && !twitch.startsWith('twitch.tv/'))
    || (twitter.length > 0 && !twitter.startsWith('twitter.com/'))
    || (reddit.length > 0 && !reddit.startsWith('reddit.com/u/'))
    || (github.length > 0 && !github.startsWith('github.com/'))
    || (youtube.length > 0 && !youtube.startsWith('youtube.com/'))) {
        res.send('Invalid links provided <a href="/settings">go back</a>');
        return;
    }
    
    let conns = [];
    
    if (twitch) conns.push({ service: 'twitch', url: twitch })
    if (twitter) conns.push({ service: 'twitter', url: twitter })
    if (reddit) conns.push({ service: 'reddit', url: reddit })
    if (github) conns.push({ service: 'github', url: github })
    if (youtube) conns.push({ service: 'youtube', url: youtube })
    
    User.updateOne({ uuid: req.user.uuid }, { connections: conns }, async (shit1, shit2, shit3) => {
        await res.redirect('/settings');
    });
});

router.post('/v1/like', ensureAuthenticated, async (req, res) => {
    if (req.query.id) {
        const exists = await News.exists({ _id: req.query.id });
        if (!exists) { res.status(400).json({ status: 'fail' }); return; }
        
        const doc = await News.findOne({ _id: req.query.id });
        let newLikes, action;
        
        if (doc.likes.includes(req.user.uuid)) {
            newLikes = doc.likes;
            newLikes.splice(newLikes.indexOf(req.user.uuid), 1);
            
            action = 'unlike-lmfao';
        } else {
            newLikes = doc.likes;
            newLikes.push(req.user.uuid);
            
            action = 'liked';
        }
        
        News.updateOne({ _id: req.query.id }, { likes: newLikes }, async (shit1, shit2, shit3) => {
            await res.json({ status: 'success', action });
        });
    } else await res.status(400).json({status: 'fail'});
});

module.exports = router;
