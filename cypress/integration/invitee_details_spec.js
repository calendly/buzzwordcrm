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

const userResource = {
  "avatar_url": null,
  "created_at": "2019-10-17T13:23:46.287139Z",
  "current_organization": "https://api.calendly.com/organizations/ORGANIZATION_UUID",
  "email": "mail@org.com",
  "name": "John Doe",
  "resource_type": "User",
  "scheduling_url": "https://calendly.com/user",
  "slug": "userslug",
  "timezone": "America/New_York",
  "updated_at": "2019-10-17T13:23:46.287139Z",
  "uri": "https://api.calendly.com/users/USER_UUID",
};

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
    uri: 'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA',
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
    no_show: {
      uri: 'https://api.calendly.com/invitee_no_shows/639fa667-4c1b-4b20-93b5-1b1969d67dc7',
    },
    uri: 'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2/invitees/ABAAAAAAAAAAAAAAA',
    status: 'active',
    timezone: 'America/Los_Angeles',
  },
];

const eventInviteesPagination = {
    "count": 20,
    "next_page": "https://calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees?count=1&page_token=sNjq4TvMDfUHEl7zHRR0k0E1PCEJWvdi",
    "previous_page": "https://calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees?count=1&page_token=VJs2rfDYeY8ahZpq0QI1O114LJkNjd7H",
    "next_page_token": "sNjq4TvMDfUHEl7zHRR0k0E1PCEJWvdi",
    "previous_page_token": "VJs2rfDYeY8ahZpq0QI1O114LJkNjd7H"
}

const noShow = {
  uri: 'https://api.calendly.com/invitee_no_shows/639fa667-4c1b-4b20-93b5-1b1969d67dc7',
  invitee:
    'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2/invitees/ABAAAAAAAAAAAAAAA',
  created_at: '2019-01-02T03:04:05.678123Z',
};

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
        url: '/api/event_types?',
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
    ).as('scheduledEvents');

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
        pagination: eventInviteesPagination,
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/users/me',
      },
      {
          resource: userResource,
      }
    )

    cy.visit('/login');
    cy.get('.btn-large').click();
    cy.get('nav').contains('Events').click();
    cy.wait('@scheduledEvents');
    cy.get('td').eq(0).contains('First chat').click();
    cy.get('.scheduled-event-header').contains('First chat');
    cy.get('.details-link')
      .contains('Click here for invitee details')
      .click();
    cy.get('tbody').contains('John Doe');
    cy.get('tbody').contains('john_doe@hotmail.com');
    cy.get('tbody').contains('4/26/2022, 7:48:19 PM');
    cy.get('tbody').contains(
      'Question: What is your favorite animal? Answer: Dolphin'
    );
    cy.get('tbody').contains(
      'Question: What type of cuisine do you like the most? Answer: Japanese'
    );
    cy.get('tbody').contains('No');
    cy.get('tbody').contains('America/New_York');
    cy.get('tbody').contains('Jane Doe');
    cy.get('tbody').contains('jane_doe@gmail.com');
    cy.get('tbody').contains('4/20/2022, 5:30:22 PM');
    cy.get('tbody').contains(
      'Question: What is your favorite animal? Answer: Elephant'
    );
    cy.get('tbody').contains(
      'Question: What type of cuisine do you like the most? Answer: Mexican'
    );
    cy.get('tbody').contains('No');
    cy.get('tbody').contains('America/Los_Angeles');
  });

  it('Should allow user to mark invitees as a no-show, and undo no-show marking', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/events/*/invitees*',
      },
      {
        invitees: eventInvitees,
        pagination: eventInviteesPagination,
      }
    );

    cy.intercept(
      {
        method: 'POST',
        url: 'api/no_shows',
      },
      {
        body: 'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA',
      },
      noShow
    ).as('markNoShow');

    cy.intercept(
      {
        method: 'DELETE',
        url: 'api/no_shows/*',
      },
      {}
    ).as('undoNoShow');

    cy.get('tbody').contains('Mark As No-Show').click();
    cy.wait('@markNoShow')
      .its('response.body')
      .should(
        'include',
        'https://api.calendly.com/scheduled_events/GFGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA'
      );
    cy.get('tbody').contains('Undo No-Show').click();
    cy.get('@undoNoShow').should(({ request, response }) => {
      expect(request.method).to.equal('DELETE');
      expect(response.statusCode).to.equal(200);
    });
  });
});
