const eventTypeList = require('./../fixtures/eventTypeList.json')

describe('Event Type Details', () => {
  it('Should have clickable event-type cards to view event type availability and details', () => {
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
    ).as('login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types?',
      },
      {
        eventTypes: eventTypeList,
      }
    ).as('eventTypeList');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types/*',
      },
      {
        eventType: eventTypeList[0],
      }
    ).as('eventTypeList');

    cy.visit('/login');
    cy.contains('Log in with Calendly').click();
    cy.wait('@eventTypeList');
    cy.get('.container:first').contains('View Availability').click({ force: true });
    cy.get('.calendly-close-overlay').click({ force: true });
    cy.get('.card-content:first').click({ force: true });
    cy.get('h5').contains('First chat');
    cy.get('.event-status').contains('Active');
    cy.get('.event-type-custom-questions').contains(
      'What would you like the power to do?'
    );
    cy.get('.event-duration').contains('30 minutes');
  });
});
