const express = require('express');
const CalendlyService = require('../services/calendlyService');
const {
  isUserAuthenticated,
  formatEventDateTime,
  formatEventTypeDate,
  formatInviteeDateTime,
  formatEventTypeAvailTime,
} = require('../utils');
const router = express.Router();
const User = require('../models/userModel');

router
  .get('/scheduled_events', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token, calendly_uid } = req.user;
      const { count, page_token, status, max_start_time, min_start_time } =
        req.query;
      const calendlyService = new CalendlyService(access_token, refresh_token);

      const { collection, pagination } =
        await calendlyService.getUserScheduledEvents(
          calendly_uid,
          count,
          page_token,
          status,
          max_start_time,
          min_start_time
        );

      const events = collection.map(formatEventDateTime);

      res.json({ events, pagination });
    } catch (error) {
      next(error);
    }
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
  .get(
    '/event_type_available_times',
    isUserAuthenticated,
    async (req, res, next) => {
      try {
        const { access_token, refresh_token, calendly_uid } = req.user;

        const calendlyService = new CalendlyService(
          access_token,
          refresh_token
        );
        const { event_type, end_time, start_time } = req.query;

        const { collection } = await calendlyService.getUserEventTypeAvailTimes(
          event_type,
          start_time,
          end_time,
          calendly_uid
        );

        const availableSlots = collection.map(formatEventTypeAvailTime);

        res.json({ availableSlots });
      } catch (error) {
        next(error);
      }
    }
  )
  .get('/user_busy_times', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token, calendly_uid } = req.user;

      const calendlyService = new CalendlyService(access_token, refresh_token);
      const { user, start_time, end_time } = req.query;

      const { collection } = await calendlyService.getUserBusyTimes(
        user,
        start_time,
        end_time,
        calendly_uid
      );

      const busyTimes = collection.map(formatEventDateTime);

      res.json({ busyTimes });
    } catch (error) {
      next(error);
    }
  })
  .get(
    '/user_availability_schedules',
    isUserAuthenticated,
    async (req, res, next) => {
      try {
        const { access_token, refresh_token, calendly_uid } = req.user;

        const calendlyService = new CalendlyService(
          access_token,
          refresh_token
        );

        const { user } = req.query;

        const { collection: availabilitySchedules } =
          await calendlyService.getUserAvailabilitySchedules(
            user,
            calendly_uid
          );

        res.json({ availabilitySchedules });
      } catch (error) {
        next(error);
      }
    }
  )
  .get('/users/:uuid', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;

      const calendlyService = new CalendlyService(access_token, refresh_token);

      const { uuid } = req.params;

      const { resource } = await calendlyService.getUser(uuid);

      res.json({ resource });
    } catch (error) {
      next(error);
    }
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
      next(error);
    }
  })
  .delete('/no_shows/:uuid', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;
      const { uuid } = req.params;
      const calendlyService = new CalendlyService(access_token, refresh_token);

      await calendlyService.undoNoShow(uuid);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  })
  .post('/cancel_event/:uuid', isUserAuthenticated, async (req, res, next) => {
    try {
      const { access_token, refresh_token } = req.user;
      const { uuid } = req.params;
      const { reason } = req.body;
      const calendlyService = new CalendlyService(access_token, refresh_token);

      const resource = await calendlyService.cancelEvent(uuid, reason);

      res.json({ resource });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
