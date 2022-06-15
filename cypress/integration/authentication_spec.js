describe('Authentication', () => {
  it('Enables users to login and out', () => {
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

    cy.visit('/login');
    cy.get('nav').contains('Logout').should('not.exist');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Logout').click();
    cy.get('nav').contains('Logout').should('not.exist');
  });
});

describe('Nav bar render', () => {
  it('Should NOT be present if user has not logged in', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types',
      },
      {
        eventTypes: [],
      }
    );

    cy.visit('/login');
    cy.get('nav').should('not.exist');
  });
});
