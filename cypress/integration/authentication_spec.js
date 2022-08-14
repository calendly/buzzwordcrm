const stubAuth = () => {
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
}

const stubEventTypes = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/api/event_types',
    },
    {
      eventTypes: [],
    }
  );
}

describe('Authentication', () => {
  it('Enables users to login and out', () => {
    stubAuth()
    stubEventTypes()
    cy.visit('/login');
    cy.get('nav').contains('Logout').should('not.exist');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Logout').click();
    cy.get('nav').contains('Logout').should('not.exist');
  });
});

describe.only('Nav bar render', () => {
  it('Should NOT be present if user has not logged in', () => {
    cy.intercept('/api/authenticate').as('auth')
    cy.visit('/login');
    cy.wait('@auth')
    cy.get('#nav-mobile').should('not.exist');
  });
});
