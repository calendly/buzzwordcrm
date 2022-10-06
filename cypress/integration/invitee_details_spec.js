const scheduledEvents = [
  {
    uri: 'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2',
    name: 'First chat',
    date: '04/28/2022',
    start_time: '2022-04-28T20:00:00.000Z',
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
    event: 'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2',
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
    no_show: null,
    status: 'active',
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
    no_show: null,
    status: 'active',
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
        url: '/api/events/*/invitees*',
      },
      {
        invitees: eventInvitees,
      }
    );

    cy.visit('/login');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Events').click();
    cy.get('td').eq(0).contains('First chat').click();
    cy.get('.scheduled-event-header').contains('First chat');
    cy.get('.invitee-details-link')
      .contains('Click here for invitee details')
      .click();
    cy.get('tbody').contains('John Doe')
    cy.get('tbody').contains('john_doe@hotmail.com')
    cy.get('tbody').contains('4/26/2022, 7:48:19 PM')
    cy.get('tbody').contains('Question: What is your favorite animal? Answer: Dolphin')
    cy.get('tbody').contains('Question: What type of cuisine do you like the most? Answer: Japanese')
    cy.get('tbody').contains('No')
    cy.get('tbody').contains('America/New_York')
    cy.get('tbody').contains('Jane Doe')
    cy.get('tbody').contains('jane_doe@gmail.com')
    cy.get('tbody').contains('4/20/2022, 5:30:22 PM')
    cy.get('tbody').contains('Question: What is your favorite animal? Answer: Elephant')
    cy.get('tbody').contains('Question: What type of cuisine do you like the most? Answer: Mexican')
    cy.get('tbody').contains('No')
    cy.get('tbody').contains('America/Los_Angeles')
  });

  it('Should allow user to toggle an invitee as a no-show or not', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/events/*/invitees*',
      },
      {
        invitees: eventInvitees,
      }
    );

    cy.intercept(
      {
       method: 'POST',
       url: 'api/no_shows'
      },
      [scheduledEvents[0], scheduledEvents[1]]
    ).as('markNoShow')

    cy.intercept(
      {
       method: 'DELETE',
       url: 'api/no_shows/*'
      },
      [scheduledEvents[0], scheduledEvents[1]]
    ).as('removeNoShow')

    cy.get('tbody').contains('Mark As No-Show').click().wait('@markNoShow')
    cy.get('tbody').contains('Mark As No-Show').click().wait('@removeNoShow')
  })
});
