const eventTypeList = require('./../fixtures/eventTypeList.json')

describe('Dashboard', () => {
  it('Should show indv event-type cards', () => {
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
        url: '/api/event_types',
      },
      {
        eventTypes: eventTypeList,
      }
    ).as('eventTypeList');

    cy.visit('/login');
    cy.contains('Log in with Calendly').click();
    cy.wait('@eventTypeList')
    cy.get('.card-content').contains('First chat');
    cy.get('.card-content').contains('Second chat');
    cy.get('.card-content').contains('Third chat');
    cy.get('.card-content').contains('Fourth chat');
    cy.get('.card-content').contains('Introductory meeting');
    cy.get('.card-content').contains('Follow-up meeting');
    cy.get('.card-content').contains('Follow-up to the follow-up meeting');
    cy.get('.card-content').contains('No description');
  });

  it('Should allow scheduling popup to render and close', () => {
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
        url: '/api/event_types',
      },
      {
        eventTypes: eventTypeList,
      }
    ).as('eventTypeList');

    cy.visit('/login');
    cy.contains('Log in with Calendly').click();
    cy.wait('@eventTypeList')
    cy.get('.card-action > button').click({ multiple: true, force: true });
    cy.get('.calendly-popup-content').should('exist');
    cy.get('.calendly-close-overlay').click({ multiple: true, force: true });
  });
});
