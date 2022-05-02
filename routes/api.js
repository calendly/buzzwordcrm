const express = require('express');
const CalendlyService = require('../services/calendlyService');
const { isUserAuthenticated, formatEventDateTime } = require('../utils');
const router = express.Router();
const User = require('../models/userModel');

router
  .get('/scheduled_events', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token, calendly_uid } = req.user;
    const { count, page_token } = req.query;
    const calendlyService = new CalendlyService(access_token, refresh_token);

    const { collection, pagination } =
      await calendlyService.getUserScheduledEvents(
        calendly_uid,
        count,
        page_token
      );

    const events = collection.map(formatEventDateTime);

    res.json({ events, pagination });
  })
  .get('/event_types', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token, calendly_uid } = req.user;
    const calendlyService = new CalendlyService(access_token, refresh_token);
    const { collection: eventTypes, pagination } =
      await calendlyService.getUserEventTypes(calendly_uid);

    res.json({ eventTypes, pagination });
  })
  .get('/events/:uuid', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token } = req.user;
    const { uuid } = req.params

    const calendlyService = new CalendlyService(access_token, refresh_token);

    const { resource } = await calendlyService.getUserScheduledEvent(uuid);
    const event = formatEventDateTime(resource)

    res.json({ event });
  })
  .get('/authenticate', async (req, res) => {
    let user;

    if (req.user) {
      user = await User.findById(req.user.id);
    }

    res.json({ authenticated: !!user });
  });

module.exports = router;
