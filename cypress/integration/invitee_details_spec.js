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
      total: 2,
      active: 2,
      limit: 2,
    },
  },
];

const eventInvitees = [
  {
    event: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    name: 'John Doe',
    email: 'john_doe@hotmail.com',
    scheduled_at: '4/26/2022, 7:48:19 PM',
    questions_and_answers: [
      {
        answer: 'Dolphin',
        position: 0,
        question: 'What is your favorite animal?',
      },
      {
        answer: 'Japanese',
        position: 1,
        question: 'What type of cuisine do you like the most?',
      },
    ],
    rescheduled: false,
    timezone: 'America/New_York',
  },
  {
    event: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    name: 'Jane Doe',
    email: 'jane_doe@gmail.com',
    scheduled_at: '4/20/2022, 5:30:22 PM',
    questions_and_answers: [
      {
        answer: 'Elephant',
        position: 0,
        question: 'What is your favorite animal?',
      },
      {
        answer: 'Mexican',
        position: 1,
        question: 'What type of cuisine do you like the most?',
      },
    ],
    rescheduled: false,
    timezone: 'America/Los_Angeles',
  },
];

describe('Scheduled Event Invitee Details', () => {
  it('Scheduled event invitee details link should be clickable, and route to invitee details for that event', () => {
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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/events/*',
      },
      {
        event: scheduledEvents[0],
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/events/*/invitees',
      },
      {
        invitees: eventInvitees,
      }
    );

    cy.visit('/login');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Events').click();
    cy.get('td').eq(0).contains('First chat').click({ force: true });
    cy.get('.invitee-details-link')
      .contains('Click here for invitee details')
      .click({ force: true });
  });
});
