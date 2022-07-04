const express = require('express');
const router = express.Router();
const config = require('../Configuration/Tickets');
const rankcfg = require('../Configuration/Ranks');
const { forwardAuthenticated, ensureAuthenticated } = require('../Internals/AuthHelpers');
const moment = require('moment');

const User = require('../Models/User');
const Ticket = require('../Models/Ticket');

router.get('/', ensureAuthenticated, async (req, res) => {
    Ticket.find({ author: req.user.uuid }).then(async tickets => {
        await res.render('tickets/main', { getResponded, moment, req, config, tickets });
    });
});

function getResponded(ticketID) {
    Ticket.findOne({ _id: ticketID }).then(ticket => {
       if (!ticket.reply) return 'N/A';
       return moment(ticket.reply.date).fromNow();
    });
}

router.get('/create', ensureAuthenticated, async (req, res) => {
    await res.render('tickets/cats', { req, config });
});

router.get('/create/:id', ensureAuthenticated, async (req, res) => {
    await res.render('tickets/create', { req, config });
});

router.post('/create/:id', ensureAuthenticated, async (req, res) => {
    if (!Object.keys(config).includes(req.params.id)) {
        res.send('stop in the name of the law.');
        return;
    }

    const fields = [];

    for (const shit in req.body) {
        fields.push({ type: shit.split("##")[0], question: shit.split("##")[1], body: req.body[shit] });
    }

    const ticket = new Ticket({
        title: `${req.user.username}'s ${config[req.params.id].name}`,
        type: req.params.id,
        fields,
        author: req.user.uuid
    });

    ticket.save()
        .then(async ignored => {
            res.redirect(`/support/${ticket._id}`);
        })
        .catch(async ignored => res.send('This process failed. Please contact an Administrator!'))
});



router.get('/:id', ensureAuthenticated, async (req, res) => {
    const exists = await Ticket.exists({ _id: req.params.id });
    if (exists) {
        Ticket.findOne({ _id: req.params.id }).then(ticket => {
            let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

            if (req.user.uuid === ticket.author || rank.permissions.includes('TICKETS_MODERATE')|| rank.permissions.includes('*')) {
                User.findOne({ uuid: ticket.author }).then(user => {
                    res.render('tickets/ticket', { rankcfg, moment, config, ticket, req, user });
                });
            } else res.render('403', { req });
        });
    } else res.render('404', { req });
});

router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
    const exists = await Ticket.exists({ _id: req.params.id });
    if (exists) {
        Ticket.findOne({ _id: req.params.id }).then(ticket => {
            if (req.user.uuid === ticket.author) {
                ticket.delete();
                res.redirect('/support');
            } else res.render('403', { req });
        });
    } else res.render('404', { req });
});

router.get('/reply/:id', ensureAuthenticated, async (req, res) => {
    const exists = await Ticket.exists({ _id: req.params.id });
    if (exists) {
        Ticket.findOne({ _id: req.params.id }).then(ticket => {
            let rank = rankcfg.ranks.find(r => r.id === req.user.rank);

            if (rank.permissions.includes('TICKETS_ADMIN') || rank.permissions.includes('TICKETS_MODERATE') || rank.permissions.includes('*')) {
                User.findOne({ uuid: ticket.author }).then(async author => {
                    await res.render('tickets/reply', { req, config, rankcfg, ticket, author });
                });
            } else res.render('403', { req });
        });
    } else res.render('404', { req });
});

module.exports = router;