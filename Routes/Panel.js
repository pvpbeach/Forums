const express = require('express');
const router = express.Router();
const rankcfg = require('../Configuration/Ranks');
const moment = require('moment');
const { ensureAuthenticated } = require('../Internals/AuthHelpers');
const process = require('process');

const User = require('../Models/User');
const News = require('../Models/News');

router.get('/', ensureAuthenticated, async (req, res) => {
    let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

    if (rank.permissions.includes('STAFF')|| rank.permissions.includes('*')) {
        await res.render('panel/index', { req, rank });
    } else await res.render('403', {req})
});

router.get('/exec', ensureAuthenticated, async (req, res) => {
    let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

    if (rank.permissions.includes('*')) {
        await res.render('panel/exec', { req, rank });
    } else await res.render('403', {req});
});

router.post('/exec', ensureAuthenticated, async (req, res) => {
    let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

    if (rank.permissions.includes('*')) {
        let evaled = await eval(`(async () => { ${req.query.toEval} })();`);
        evaled = (typeof evaled !== 'string') ? require('util').inspect(evaled) :
            (!evaled || evaled.length < 1) ?
                'No output.' :
                evaled;

        await res.send(evaled);
    } else await res.render('403', {req});
});


router.get('/restart', ensureAuthenticated, async (req, res) => {
    let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

    if (rank.permissions.includes('*')) {
        await res.render('panel/restart', { req, rank });
    }  else await res.render('403', {req});
});

router.post('/restart', ensureAuthenticated, async (req, res) => {
    let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

    if (rank.permissions.includes('*')) {
        res.send('ok');
        process.exit(0);
    } else await res.render('403', {req});
});

module.exports = router;