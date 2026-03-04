const dateInFuture = new Date(new Date().setFullYear(new Date().getFullYear() + 30));
const dateInFutureDateFormat = Intl.DateTimeFormat(undefined,{ year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "UTC"}).format(dateInFuture)
const dateInFutureTimeFormat = Intl.DateTimeFormat(undefined,{ hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC"}).format(dateInFuture)

const scheduledEvents = [
  {
    uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
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
      total: 1,
      active: 1,
      limit: 1,
    },
  },
  {
    uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ4',
    name: 'Second chat',
    date: '05/03/2022',
    start_time: '2022-05-03T19:00:00.000Z',
    start_time_formatted: '03:00 PM',
    end_time_formatted: '03:30 PM',
    status: 'canceled',
  },
  {
    uri: 'https://api.calendly.com/scheduled_events/GFBGBDCAADAEDCRZ4',
    name: 'Third chat',
    date: dateInFutureDateFormat,
    start_time: dateInFuture.toISOString(),
    start_time_formatted: dateInFutureTimeFormat,
    end_time_formatted: '03:30 PM',
    status: 'active',
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

const scheduledEventsPagination = {
  "count": 0,
}

describe('Scheduled Events', () => {
  it('Should render a table of all scheduled events, allowing filtering by all, active, and canceled events', () => {
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
        pagination: scheduledEventsPagination
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/scheduled_events?&status=active',
      },
      {
        events: [scheduledEvents[0], scheduledEvents[2]],
        pagination: scheduledEventsPagination
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/scheduled_events?&status=canceled',
      },
      {
        events: [scheduledEvents[1]],
        pagination: scheduledEventsPagination
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
    cy.get('td').eq(0).should('have.text', 'First chat');
    cy.get('td').eq(1).should('have.text', '04/28/2022');
    cy.get('td').eq(2).should('have.text', '04:00 PM');
    cy.get('td').eq(3).should('have.text', '05:00 PM');
    cy.get('td').eq(4).should('have.text', 'ACTIVE');
    cy.get('td').eq(5).should('have.text', 'Second chat');
    cy.get('td').eq(6).should('have.text', '05/03/2022');
    cy.get('td').eq(7).should('have.text', '03:00 PM');
    cy.get('td').eq(8).should('have.text', '03:30 PM');
    cy.get('td').eq(9).should('have.text', 'CANCELED');
    cy.get('td').eq(10).should('have.text', 'Third chat');
    cy.get('td').eq(11).should('have.text', dateInFutureDateFormat);
    cy.get('td').eq(12).should('have.text', dateInFutureTimeFormat);
    cy.get('td').eq(13).should('have.text', '03:30 PM');
    cy.get('td').eq(14).should('have.text', 'ACTIVE');
    cy.get('.css-4xgw5l-IndicatorsContainer2').click();
    cy.get('.css-1plh46m-MenuList2').contains('Active Events').click();
    cy.get('td').eq(0).should('have.text', 'First chat');
    cy.get('td').eq(1).should('have.text', '04/28/2022');
    cy.get('td').eq(2).should('have.text', '04:00 PM');
    cy.get('td').eq(3).should('have.text', '05:00 PM');
    cy.get('td').eq(4).should('have.text', 'ACTIVE');
    cy.get('td').eq(5).should('have.text', 'Third chat');
    cy.get('td').eq(6).should('have.text', dateInFutureDateFormat);
    cy.get('td').eq(7).should('have.text', dateInFutureTimeFormat);
    cy.get('td').eq(8).should('have.text', '03:30 PM');
    cy.get('td').eq(9).should('have.text', 'ACTIVE');
    cy.get('.css-4xgw5l-IndicatorsContainer2').click();
    cy.get('.css-1plh46m-MenuList2').contains('Canceled Events').click();
    cy.get('td').eq(0).should('have.text', 'Second chat');
    cy.get('td').eq(1).should('have.text', '05/03/2022');
    cy.get('td').eq(2).should('have.text', '03:00 PM');
    cy.get('td').eq(3).should('have.text', '03:30 PM');
    cy.get('td').eq(4).should('have.text', 'CANCELED');
    cy.get('.css-4xgw5l-IndicatorsContainer2').click();
    cy.get('.css-1plh46m-MenuList2').contains('All Events').click();
    cy.get('td').eq(0).should('have.text', 'First chat');
    cy.get('td').eq(1).should('have.text', '04/28/2022');
    cy.get('td').eq(2).should('have.text', '04:00 PM');
    cy.get('td').eq(3).should('have.text', '05:00 PM');
    cy.get('td').eq(4).should('have.text', 'ACTIVE');
    cy.get('td').eq(5).should('have.text', 'Second chat');
    cy.get('td').eq(6).should('have.text', '05/03/2022');
    cy.get('td').eq(7).should('have.text', '03:00 PM');
    cy.get('td').eq(8).should('have.text', '03:30 PM');
    cy.get('td').eq(9).should('have.text', 'CANCELED');
    cy.get('td').eq(10).should('have.text', 'Third chat');
    cy.get('td').eq(11).should('have.text', dateInFutureDateFormat);
    cy.get('td').eq(12).should('have.text', dateInFutureTimeFormat);
    cy.get('td').eq(13).should('have.text', '03:30 PM');
    cy.get('td').eq(14).should('have.text', 'ACTIVE');
  });

  it('Should allow cancellation of future events', () => {
    const stub = cy.stub();

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
        method: 'POST',
        url: 'api/cancel_event/*',
      },
      {
        body: {
          reason: 'Forgot I have a different meeting.',
        },
      }
    );

    //The scheduled events test console will show an alert that the specific event was successfully canceled. This test asserts that the alert output is correct.
    cy.get('tbody').contains('Cancel Event').click();
    cy.get('.popup-box').contains('Yes, cancel').click({ force: true });
    cy.on('window:alert', (alertMessage) => {
      expect(alertMessage).to.equal(
        `You have successfully canceled the following event: "Third chat" on ${dateInFutureDateFormat} at ${dateInFutureTimeFormat}!`
      );
    });
  });
});
