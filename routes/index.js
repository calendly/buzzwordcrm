const express = require('express');
const { isUserAuthenticated, formatEventDateTime } = require('../utils');
const CalendlyService = require('../services/calendlyService');
const router = express.Router();

router
    .get('/', (req, res) => {
        if (req.user) {
            return res.render('dashboard', { isLoggedIn: !!req.user });
        }
        res.render('index');
    })
    .get('/logout', (req, res) => {
        if (req.user) {
            req.session = null;
        }
        res.redirect('/');
    })
    .get('/dashboard', isUserAuthenticated, async (req, res) => {
        const { access_token, refresh_token, calendly_uid } = req.user;
        const calendlyService = new CalendlyService(
            access_token,
            refresh_token
        );
        const {
            collection: eventTypes,
            pagination
        } = await calendlyService.getUserEventTypes(calendly_uid);

        res.render('dashboard', { isLoggedIn: true, eventTypes, pagination });
    })
    .get('/events', isUserAuthenticated, async (req, res) => {
        const { access_token, refresh_token, calendly_uid } = req.user;
        const calendlyService = new CalendlyService(
            access_token,
            refresh_token
        );
        const {
            collection,
            pagination
        } = await calendlyService.getUserScheduledEvents(calendly_uid);
        const events = collection.map(formatEventDateTime);

        res.render('events', { isLoggedIn: true, events, pagination });
    });

module.exports = router;
