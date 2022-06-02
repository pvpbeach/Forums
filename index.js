/**
 * Fynda - A modern Minecraft server ticket system
 * Created by Hydrogen using ExpressJS, MongoDB and other open-source technologies.
 *
 * Copyright (C) 2020 Hydrogen. All rights reserved.
 * For more information on Copyright, view LICENSE.
 */

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const logger = require('./Internals/Logger');
const MongoStore = require('connect-mongo');

const app = express();

const db = require('./Configuration/Database');
const tickets = require('./Configuration/Tickets');

require('./Internals/PassportManager')(passport);

mongoose.connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        await logger.success('Connected to the database');
    }).catch(async err => await logger.error('Failed to connect to the database:\n' + err));

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/Static`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use(
    session({
        secret: 'SECRET',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongoUrl: db.uri,
            authSource: db.authSource
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cors());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// ok

// app.use(async (req, res, next) => {
//     //fetch name from UUID
//     if (req.isAuthenticated()) {
//         await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${req.user.uuid}`)
//             .then(r => r.json())
//             .then(r => {
//             //    console.log(r);
//
//                 if (r.name !== req.user.username) {
//                     //sync name
//                     res.render('sync', { req });
//                     User.updateOne({ uuid: req.user.uuid }, { username: r.name }, async (err, affected, resp) => {
//                        await console.log(`Updated profile for user by UUID ${req.user.uuid} (now: ${r.name})`);
//                     });
//                 } else next();
//             });
//     } else next();
// });

app.use('/', require('./Routes/Home'));
app.use('/api', require('./Routes/API'));
app.use('/auth', require('./Routes/Auth'));
app.use('/panel', require('./Routes/Panel'));
app.use('/support', require('./Routes/Tickets'));

app.use((req, res, next) => {
    res.status(404);

    if (req.accepts('html')) {
        res.render('404', { req });
        return;
    }

    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});

app.listen(42500, async () => {
    await logger.success('Web server started. Listening for connections on port 42500, bound to all IPs');
});