// I get a 500 with this test (at /scheduled_events): 'Uncaught (in promise) SyntaxError: Unexpected token < in JSON at position 0'
const scheduledEvents = [
    {
        uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
        name: 'First chat',
        date: '2020-01-02T03:00:00.000000Z',
        start_time_formatted: '2020-01-02T03:00:00.000000Z',
        end_time_formatted: '2020-01-02T03:00:00.000000Z',
        status: 'active'
    },
    {
        uri: 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ4',
        name: 'Second chat',
        date: '2020-01-02T03:00:00.000000Z',
        start_time_formatted: '2020-01-02T03:00:00.000000Z',
        end_time_formatted: '2020-01-02T03:00:00.000000Z',
        status: 'canceled'
    }
]
  
  describe('Events tab in dashboard', () => {
    it('Should route user to page with all scheduled events', () => {
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
          eventTypes: []
        }
      );

      cy.intercept(
        {
            method: 'GET',
            url: '/api/scheduled_events',
          },
          {
            events: scheduledEvents
          }
      )

      cy.visit('/')
      cy.get('.btn-large').click();
      cy.get('nav').contains('Events').click()
    });
  });
