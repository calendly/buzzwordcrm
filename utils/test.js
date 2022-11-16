const nock = require('nock');
const { CALENDLY_AUTH_BASE_URL, CALENDLY_API_BASE_URL } = process.env;

exports.mockCalendlyAuthentication = () => {
  nock(CALENDLY_AUTH_BASE_URL).persist().post('/oauth/token').reply(200, {
    access_token: 'fakeToken',
    refresh_token: 'refreshToken',
  });

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get('/users/me')
    .reply(200, {
      resource: {
        uri: 'someuri',
      },
    });
};

exports.mockCalendlyScheduledEvents = () => {
  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get('/scheduled_events')
    .reply(200, {
      resource: {
        collection: [],
        pagination: {},
      },
    });
};

exports.mockCalendlyEventTypes = () => {
  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get('/event_types')
    .reply(200, {
      resource: {
        collection: [],
        pagination: {},
      },
    });
};

exports.mockCalendlyEvent = (uuid = 'someUuid') => {

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get(`/scheduled_events/${uuid}`)
    .reply(200, {
      resource: {
        uri: 'Event uri',
      },
    });
};

exports.mockCalendlyInvitees = () => {
  const uuid = 'someUuid';

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get(`/scheduled_events/${uuid}/invitees`)
    .reply(200, {
      resource: {
        collection: [],
        pagination: {},
      },
    });
};

exports.mockCalendlyNoShows = () => {
  const inviteeUri = 'someUri';

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .post('/invitee_no_shows', { invitee: inviteeUri })
    .reply(201, {
      resource: {
        uri: 'no-showUri',
      },
    });
};

exports.mockCalendlyUndoNoShow = () => {
  const uuid = 'someUuid';

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .delete(`/invitee_no_shows/${uuid}`)
    .reply(204);
};

exports.mockCalendlyCancelEvent = () => {
  const uuid = 'someUuid';

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .post(`/scheduled_events/${uuid}/cancellation`, { reason: 'TBD' })
    .reply(201, {
      resource: {
        canceled_by: 'someName',
      },
    });
};
