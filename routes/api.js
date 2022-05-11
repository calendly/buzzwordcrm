const express = require('express');
const CalendlyService = require('../services/calendlyService');
const {
  isUserAuthenticated,
  formatEventDateTime,
  formatEventTypeDate,
  formatInviteeDateTime,
} = require('../utils');
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
  .get('/event_types/:uuid', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token } = req.user;
    const calendlyService = new CalendlyService(access_token, refresh_token);
    const { uuid } = req.params;
    const { resource } = await calendlyService.getUserEventType(uuid);

    const eventType = formatEventTypeDate(resource);

    res.json({ eventType });
  })
  .get('/events/:uuid', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token } = req.user;
    const { uuid } = req.params;

    const calendlyService = new CalendlyService(access_token, refresh_token);

    const { resource } = await calendlyService.getUserScheduledEvent(uuid);
    const event = formatEventDateTime(resource);

    res.json({ event });
  })
  .get('/events/:uuid/invitees', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token } = req.user;
    const { uuid } = req.params;

    const { count, page_token } = req.query;

    const calendlyService = new CalendlyService(access_token, refresh_token);

    const { collection, pagination } =
      await calendlyService.getUserScheduledEventInvitees(
        uuid,
        count,
        page_token
      );
    const invitees = collection.map(formatInviteeDateTime);

    res.json({ invitees, pagination });
  })
  .get('/authenticate', async (req, res) => {
    let user;

    if (req.user) {
      user = await User.findById(req.user.id);
    }

    res.json({ authenticated: !!user });
  })
  .post('/no_shows', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;
      const { invitee } = req.body;

      const calendlyService = new CalendlyService(access_token, refresh_token);

      const { resource } = await calendlyService.markAsNoShow(invitee);

      res.json({ resource });
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete('/no_shows/:uuid', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;
      const { uuid } = req.params;
      const calendlyService = new CalendlyService(access_token, refresh_token);

      await calendlyService.undoNoShow(uuid);

      res.status(204).send('No-show successfully undone');
    } catch (error) {
      next(error);
    }
  })
  .get('/no_shows/:uuid', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;
      const { uuid } = req.params;

      const calendlyService = new CalendlyService(access_token, refresh_token);

      const { resource } = await calendlyService.findNoShow(uuid);
      console.log('found marked user=', resource);

      res.json({ resource });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
