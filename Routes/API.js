const express = require('express');
const router = express.Router();
const config = require('../Configuration/API');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const CUser = require('../Models/ClientUser');
const User = require('../Models/User');
const News = require('../Models/News');
const { ensureAuthenticated } = require('../Internals/AuthHelpers');
const configa = require('../Configuration/Ranks');


router.get('/v1/', async (req, res) => {
    res.send("This is the v1 API root. For API documentation, please refer to the \"docs\"folder.");
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
    if (req.query.auth && req.query.email && req.query.user && req.query.id) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const accessID = uuidv4();
            config.accessIDs.push({
                id: accessID.toString().toLowerCase(),
                name: req.query.user,
                email: req.query.email,
                unique: req.query.id
            });

            async function handleMail() {
                let transporter = nodemailer.createTransport({
                    host: "mail.bunni.me",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: config.email.address,
                        pass: config.email.password,
                    },
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"PvPBeach Network" <registration@pvpbeach.com>', // sender address
                    to: req.query.email, // list of receivers
                    subject: "Confirm your PvPBeach account", // Subject line
                    text: "Confirm your account to gain access to tickets and perks.", // plain text body
                    html: `
                    <h1>Confirm your account</h1>
                    <p>Let's get your account up and running.<br>Click <a href="https://pvpbeach.com/auth/register?accessID=${accessID}">here</a> to set a password for your new account.<br><hr><small>Wasn't you? Don't worry, nothing has happened. Simply ignore this email</small></p>
                    `, // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
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
    if (req.query.auth && req.query.email) {
        if (req.query.auth === config.apiKey) { // correct API key, continue
            const exists = await User.exists({ email: req.query.email });
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

//top of code dumbass


//just fucked your mother!
router.post('/v1/updaterank', async (req, res) => {
    if (req.query.auth && req.query.uuid) {
        if (req.query.auth === config.apiKey) {
            const exists = await User.exists({ uuid: req.query.uuid });
            if (!exists) { res.send('invalid'); return; }

            // if(!configa.ranks.includes(req.query.ranks)) {
            //     res.send('invalid rank retard (cope)');
            //     return;
            // }

            User.updateOne({ uuid: req.query.uuid }, { rank: req.query.rank }, async (shit1, shit2, shit3) => {
                await res.send('Updated rank for ' + req.query.uuid);
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

router.post('/v1/bio', ensureAuthenticated, async (req, res) => {
     bio = req.body.bio;

    if(bio.length === 0) {
        bio = "No bio set.";
    }else if(bio.length > 120) {
        bio = "Bio is too long.";
    }

    User.updateOne({ uuid: req.user.uuid }, { bio: bio }, async (shit1, shit2, shit3) => {
        await res.redirect('/settings');
    });
});

router.post('/v1/connections', ensureAuthenticated, async (req, res) => {
    const { reddit, twitter, twitch, youtube, github } = req.body;

    console.log(youtube.length > 0 && !youtube.startsWith('youtube.com/'));

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
       const exists = await News.exists({ id: req.query.id });
       if (!exists) { res.status(400).json({ status: 'fail' }); return; }

       const doc = await News.findOne({ id: req.query.id });
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

       News.updateOne({ id: req.query.id }, { likes: newLikes }, async (shit1, shit2, shit3) => {
           await res.json({ status: 'success', action });
       });
   } else await res.status(400).json({status: 'fail'});
});

// START - CLIENT //
router.post('/v1/client/_jxA', async (req, res) => {
    // query params expected: uneid
    if (req.query.uneid) {
        let shit = config.authids.find(id => id.unencrypted === req.query.uneid);
        if (shit){
            res.send(shit.encrypted);
        } else res.status(400).send('what the shit?')
    } else res.status(400).send('Missing required query parameters');
});

router.post('/v1/client/shitbitchfuck', async (req, res) => {
    // query params expected: id
    if (req.query.eid && req.query.ueid) {
        config.authids.push({ unencrypted: req.query.ueid, encrypted: req.query.eid });
        res.send('gaming');
    } else res.status(400).send('Missing required query parameters');
});

/**
 * Clarification:
 *   - 'auth' is so clients can connect to the servers and use features such as cosmetics, messages, friends, etc.
 *   - '_jxA' is for *actual* authentication to allow connecting to PvPBeach
 */
router.post('/v1/client/auth', async (req, res) => {
    // query params expected: hwid, version, client unique identifier
    if (req.query.hwid && req.query.ver && req.query.id) {
        if (config.client.connected.includes(req.query.hwid)) {
            res.status(403).send('suck my dick');
            return;
        }

        if (req.query.ver !== config.client.version && config.client.strict) {
            res.status(403).send('fuck me in the ass');
            return;
        }

        // authenticate, either smart or legit
        config.client.connected.push(req.query.hwid);
        res.send('auth');
    } else res.status(400).send('Missing required query parameters.');
});

router.post('/v1/client/deauth', async (req, res) => {
    // query params expected: hwid, client unique identifier
    if (req.query.hwid && req.query.id) {
        if (!config.client.connected.includes(req.query.hwid)) {
            res.status(401).send('nigga not even authed tf');
            return;
        }

        // disconnect (deauth)
        config.client.connected.splice(config.client.connected.indexOf(req.query.hwid));
        res.send('disconnect');
    } else res.status(400).send('Missing required query parameters.');
});

function validateIdentifier(id) {
    return !(id.length !== 64 || !id.includes('a'));
}

router.post('/v1/client/cosmetics/:id', async (req, res) => {
   if (req.params.id) {
        const shit = await CUser.exists({ uuid: req.params.id });
        if (!shit) {
            res.status(404).json({ status: 404, message: 'User not found in database', cape: 'none', wings: false });
            return;
        }

        const shit2 = await CUser.findOne({ uuid: req.params.id });
        res.json({ message: 'Success', cape: shit2.activeCape, wings: shit2.wings });
   } else res.status(400).json({ status: 400, message: 'lol wtf???' });
});

router.post('/v1/client/initacc/:id', async (req, res) => {
    if (req.params.id) {
        const shit = await CUser.exists({ uuid: req.params.id });
        if (shit) return;

        await new CUser({ uuid: req.params.id })
            .save();
    } else res.status(400).send('bruh wtf');
});

router.get('/v1/client/cdownload/:id', async (req, res) => {
    if (req.params.id) {
        const shit = await CUser.exists({ uuid: req.params.id });
        if (!shit) {
            res.send('bitch');
            return;
        }

        const shit2 = await CUser.findOne({ uuid: req.params.id });
        const cape = shit2.activeCape;

        if (cape !== 'none') {
            res.download(`${__dirname}/../Cosmetics/Capes/` + cape + '.png');
        } else res.send('bitch');
    }  else res.status(400).send('bruh wtf');
});
// END - CLIENT //

module.exports = router;
