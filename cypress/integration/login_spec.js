describe('Login', () => {
  it('Allows users to login', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/oauth/authorize*',
      },
      (req) => {
        req.redirect(
          'http://localhost:4000/oauth/callback?code=5BbtpL2SJIeDP4yClOJPHMJZwEDF1QkbPNaJgkTymeI',
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
    cy.get('.btn-large').click();
  });
});
