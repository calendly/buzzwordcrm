const eventTypeList = [
  {
    uri: 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA',
    name: 'First chat',
    scheduling_url: 'https://calendly.com/acmesales',
    description_plain: 'Introductory meeting',
  },
  {
    uri: 'https://api.calendly.com/users/BAAAAAAAAAAAAAAA',
    name: 'Second chat',
    scheduling_url: 'https://calendly.com/acmesales',
    description_plain: 'Follow-up meeting',
  },
  {
    uri: 'https://api.calendly.com/users/CAAAAAAAAAAAAAAA',
    name: 'Third chat',
    scheduling_url: 'https://calendly.com/acmesales',
    description_plain: 'Follow-up to the follow-up meeting',
  },
  {
    uri: 'https://api.calendly.com/users/DAAAAAAAAAAAAAAA',
    name: 'Fourth chat',
    scheduling_url: 'https://calendly.com/acmesales',
  },
];

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
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types',
      },
      {
        eventTypes: eventTypeList,
      }
    );

    cy.visit('/');
    cy.get('.btn-large').click();
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
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types',
      },
      {
        eventTypes: eventTypeList,
      }
    );

    cy.visit('/');
    cy.get('.btn-large').click();
    cy.get('.card-action > button').click({ multiple: true, force: true });
    cy.get('.calendly-popup-content').should('exist');
    cy.get('.calendly-close-overlay').click({ multiple: true, force: true });
  });
});
