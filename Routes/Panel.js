const express = require('express');
const router = express.Router();
const rankcfg = require('../Configuration/Ranks');
const ticketcfg = require('../Configuration/Tickets');
const moment = require('moment');
const { ensureAuthenticated } = require('../Internals/AuthHelpers');
const process = require('process');

const User = require('../Models/User');
const News = require('../Models/News');
const Ticket = require('../Models/Ticket');

router.use((req, res, next) => {
    req.rankData = rankcfg.ranks.find(r => r.id === req.user.rank);
    next();
});

router.get('/', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('STAFF')|| req.rankData.permissions.includes('*')) {
        let rankData = req.rankData;
        await res.render('panel/index', { req, rankData });
    } else await res.render('403', { req });
});

router.get('/tickets', ensureAuthenticated, async (req, res) => {
    if (req.rankData.permissions.includes('STAFF')|| req.rankData.permissions.includes('*')) {
        const tickets = await Ticket.find({ status: "open" }).sort({ date: -1 });
        let rankData = req.rankData;
        await res.render('panel/tickets', { req, rankData, tickets, ticketcfg });
    } else await res.render('403', { req });
});

router.get('/news', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('*')) {
        let rankData = req.rankData;
        await res.render('panel/news', { req, rankData });
    } else await res.render('403', { req });
});

router.post('/news', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('*')) {
        const { title, body } = req.body;
        if (!title || !body) return res.sendStatus(400);

        const news = new News({ title, body, author: req.user.uuid });
        news.save().then(async () => {
            await res.redirect('/post/' + news._id);
        }).catch(async err => {
            console.error(err);
            res.send('error occurred oopsie poopsie (idk how check console)');
        });
    } else await res.render('403', { req });
});

router.get('/exec', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('*')) {
        let rankData = req.rankData;
        await res.status(400).send({ status: 400, message: "ratio bozo. stop fucking hacking lmao" });
    } else await res.render('403', { req });
});

router.post('/exec', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('*')) {
        let code = req.query.toEval;
        code = code.includes('return') ? code : `return ${code}`;

        try {
            let evaled = await eval(`(async () => { ${code} })();`);
            evaled = (typeof evaled !== 'string') ? require('util').inspect(evaled) :
                (!evaled || evaled.length < 1) ?
                    'No output.' :
                    evaled;

            await res.send(evaled);
        } catch (e) {
            await res.send('An error occurred while executing\n' + e);
        }

    } else await res.render('403', { req });
});

router.get('/restart', ensureAuthenticated, async (req, res) => {

    if (req.rankData.permissions.includes('*')) {
        let rankData = req.rankData;
        await res.render('panel/restart', { req, rankData });
    } else await res.render('403', { req });
});

router.post('/restart', ensureAuthenticated, async (req, res) => {

    if (rank.permissions.includes('*')) {
        await res.send('ok');
        setTimeout(() => {
            process.exit(0);
        }, 500);
    } else await res.render('403', { req });
});

module.exports = router;