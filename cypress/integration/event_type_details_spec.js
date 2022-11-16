const eventTypeList = [
  {
    uri: 'https://api.calendly.com/event_types/ABBBAAAAAAAAAAAAAA',
    name: 'First chat',
    active: true,
    scheduling_url: 'https://calendly.com/acmesales',
    duration: 30,
    kind: 'solo',
    last_updated: '08/14/2022',
    description_plain: 'Introductory meeting',
    custom_questions: [
      { position: 0, name: 'What would you like the power to do?' },
    ],
  },
];

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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types/*',
      },
      {
        eventType: eventTypeList[0],
      }
    );

    cy.visit('/');
    cy.get('.btn-large').click();
    cy.get('.container').contains('View Availability').click({ force: true });
    cy.get('.calendly-close-overlay').click({ force: true });
    cy.get('.card-content').click({ force: true });
    cy.get('h5').contains('First chat');
    cy.get('.event-status').contains('Active');
    cy.get('.event-type-custom-questions').contains(
      'What would you like the power to do?'
    );
    cy.get('.event-duration').contains('30 minutes');
  });
});
