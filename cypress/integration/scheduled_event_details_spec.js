const scheduledEvents = [
  {
    uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    name: 'First chat',
    date: '04/28/2022',
    start_time_formatted: '04:00 PM',
    end_time_formatted: '05:00 PM',
    status: 'active',
    location: {
      type: 'physical',
      location: 'A remote island of choice',
    },
    invitees_counter: {
      total: 1,
      active: 1,
      limit: 1,
    },
  },
  {
    uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ4',
    name: 'Second chat',
    date: '05/03/2022',
    start_time_formatted: '03:00 PM',
    end_time_formatted: '03:30 PM',
    status: 'canceled',
  },
  {
    uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ4',
    name: 'Third chat',
    date: '05/10/2022',
    start_time_formatted: '03:00 PM',
    end_time_formatted: '03:30 PM',
    status: 'active',
  },
];

describe('Scheduled Event Details', () => {
  it('Scheduled event name should be clickable, and route to details of that event', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/oauth/authorize*',
      },
      (req) => {
        req.redirect(
          `${
            Cypress.config().baseUrl
          }/oauth/callback?code=5BbtpL2SJIeDP4yClOJPHMJZwEDF1QkbPNaJgkTymeI`,
          302
        );
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types',
      },
      {
        eventTypes: [],
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/scheduled_events*',
      },
      {
        events: scheduledEvents,
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/events/*',
      },
      {
        event: scheduledEvents[0],
      }
    );

    cy.visit('/login');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Events').click();
    cy.get('td').eq(0).contains('First chat').click({ force: true });
    cy.get('.scheduled-event-header').contains('First chat');
    cy.get('.scheduled-event-header').contains('04/28/2022');
    cy.get('.event-details').contains('ACTIVE');
    cy.get('.event-details').contains('04:00 PM');
    cy.get('.event-details').contains('05:00 PM');
    cy.get('.event-details').contains('A remote island of choice');
    cy.get('.event-details').contains('1/1');
    cy.get('.event-details').contains('Click here for invitee details');
    cy.get('.event-details').contains('No guests added by invitee');
  });
});
