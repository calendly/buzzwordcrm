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
};

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
};

describe('Authentication', () => {
  context('when user has logged in', () => {
    beforeEach(() => {
      stubAuth();
      stubEventTypes();
    });

    it('Enables users to login and out', () => {
      cy.visit('/login');
      cy.get('nav').contains('Logout').should('not.exist');
      cy.get('.btn-large').click();
      cy.get('nav').contains('Logout').click();
      cy.get('nav').contains('Logout').should('not.exist');
    });
  });

  context('when user has NOT logged in', () => {
    it('navbar should NOT be present', () => {
      cy.intercept('/login').as('login');
      cy.intercept('/api/authenticate').as('auth');
      cy.visit('/login');
      cy.wait(['@login', '@auth']);
      cy.get('#nav-mobile').should('not.exist');
    });
  });
});
