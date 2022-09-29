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

describe('Scheduled Events', () => {
  it('Should render a table of all scheduled events', () => {
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

    cy.visit('/login');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Events').click();
    cy.get('td').eq(0).should('have.text', 'First chat');
    cy.get('td').eq(1).should('have.text', '04/28/2022');
    cy.get('td').eq(2).should('have.text', '04:00 PM');
    cy.get('td').eq(3).should('have.text', '05:00 PM');
    cy.get('td').eq(4).should('have.text', 'ACTIVE');
    cy.get('td').eq(5).should('have.text', 'Second chat');
    cy.get('td').eq(6).should('have.text', '05/03/2022');
    cy.get('td').eq(7).should('have.text', '03:00 PM');
    cy.get('td').eq(8).should('have.text', '03:30 PM');
    cy.get('td').eq(9).should('have.text', 'CANCELED');
    cy.get('td').eq(10).should('have.text', 'Third chat');
    cy.get('td').eq(11).should('have.text', '05/10/2022');
    cy.get('td').eq(12).should('have.text', '03:00 PM');
    cy.get('td').eq(13).should('have.text', '03:30 PM');
    cy.get('td').eq(14).should('have.text', 'ACTIVE');
  });
});
