const eventTypeList = [
  {
    "active": true,
    "color": "#0099ff",
    "description_plain": "Introductory meeting.",
    "name": "First chat",
    "profile": {
        "owner": "https://api.calendly.com/users/AAAAAAAAAAAAAAAA",
    },
    "scheduling_url": "https://calendly.com/acmesales",
    "uri": "https://api.calendly.com/event_types/AAAAAAAAAAAAAAAA"
},
{
  "active": true,
  "color": "#8247f5",
  "description_plain": "Follow-up meeting.",
  "name": "Second chat",
  "profile": {
      "owner": "https://api.calendly.com/users/AAAAAAAAAAAAAAAA",
  },
  "scheduling_url": "https://calendly.com/acmesales",
  "uri": "https://api.calendly.com/event_types/BAAAAAAAAAAAAAAA"
},
{
  "active": true,
  "color": "#17e885",
  "description_plain": "Follow-up to the follow-up meeting",
  "name": "Third chat",
  "profile": {
      "owner": "https://api.calendly.com/users/AAAAAAAAAAAAAAAA",
  },
  "scheduling_url": "https://calendly.com/acmesales",
  "uri": "https://api.calendly.com/event_types/CAAAAAAAAAAAAAAA"
},
{
  "active": true,
  "color": "#0099ff",
  "name": "Fourth chat",
  "profile": {
      "owner": "https://api.calendly.com/users/AAAAAAAAAAAAAAAA",
  },
  "scheduling_url": "https://calendly.com/acmesales",
  "uri": "https://api.calendly.com/event_types/DAAAAAAAAAAAAAAA"
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
    );

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
