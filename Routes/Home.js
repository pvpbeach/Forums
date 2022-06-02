
const express = require('express');
const router = express.Router();
const config = require('../Configuration/Ranks');
const moment = require('moment');
const { ensureAuthenticated } = require('../Internals/AuthHelpers');

const User = require('../Models/User');
const News = require('../Models/News');

function limit(str, limit = 100, end = '...') {
    str = str.split(' ');

    if (str.length > limit) {
        const cutToLimit = str.slice(0, limit);
        return cutToLimit.join(' ') + ' ' + end;
    }

    return str.join(' ');
}

router.get('/', async (req, res) => {
    News.find({}).sort({ date: -1 }).limit(4).then(async news => {
        let gaming = {};

        await res.render('index', { req, news, moment, User, limit });
    });
});

router.get('/client', async (req, res) => {
    await res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

router.get('/staff', async (req, res) => {
    let staffRanks = [];

    config.ranks.forEach(rank => {
       if (rank.permissions.includes('*') || rank.permissions.includes('STAFF')) {
           staffRanks.push(rank);
       }
    });

    User.find({}).then(async users => {
        res.render('staff', { req, staffRanks, User, users });
    });
});

router.get('/royalties', async (req, res) => {
    let royalRanks = [];

    config.ranks.forEach(rank => {
       if (rank.permissions.includes('*') || rank.permissions.includes('ROYAL')) {
           royalRanks.push(rank);
       }
    });

    User.find({}).then(async users => {
        res.render('royalties', { req, royalRanks, User, users });
    });
});

router.get('/creators', async (req, res) => {
    let mediaRanks = [];

    config.ranks.forEach(rank => {
       if (rank.permissions.includes('CREATOR')) {
           mediaRanks.push(rank);
       }
    });

    User.find({}).then(async users => {
        res.render('creators', { req, mediaRanks, User, users });
    });
});

router.get('/profile/:user', async (req, res) => {
    if (req.params.user) {
        let user = await User.findOne({ username: { $regex: new RegExp(`^${req.params.user}$`), $options: 'i' } });
        if (user) {
            await res.render('profile', { req, user, ranks: config, moment })
        } else res.render('404', {req});
    } else res.render('404', {req});
});

router.get('/settings', ensureAuthenticated, async (req, res) => {
    let fetch = require("node-fetch");
    const tfaRequest = require("node-2fa").generateSecret({ name: "MineRIP Fynda", account: req.user.uuid });
    res.render('settings', { req, getConnection, tfaRequest })
});

router.get('/leaderboards', ensureAuthenticated, async (req, res) => {
    res.render('leaderboards', { req, getConnection })
 });

router.get('/post/:id', async (req, res) => {
    if (req.params.id) {
        let exists = News.exists({ _id: req.params.id });
        if (exists) {
            News.findOne({ _id: req.params.id }).then(async post => {
                await User.findOne({ uuid: post.author }).then(async user => {
                    await res.render('post', { req, post, user, ranks: config, moment })
                });
            });
        } else res.render('404', {req});
    } else res.render('404', {req});
});

router.get('/privacy', async (req, res) => {
   res.render('legal/privacy', { req });
});

router.get('/rules', async (req, res) => {
    res.redirect('https://docs.google.com/document/d/1S_M6hJ6G-poghOjCDcFoxVOtt9TjGpFTFBsP3eaKuDw/');
 });

router.get('/terms', async (req, res) => {
    res.render('legal/terms', { req });
 });

// data shit
router.get('/data/request', ensureAuthenticated, async (req, res) => {
    let user = req.user;
    user.password = '[redacted]';

    await res.json(user);
});

router.get('/data/disable', ensureAuthenticated, async (req, res) => {
    await res.render('error', { req, error: 'This function is disabled for the time being.' });
});


function getConnection(req, service) {
    let shit = req.user.connections.find(con => con.service === service);
    return shit == null ? "" : shit.url;
}

module.exports = router;