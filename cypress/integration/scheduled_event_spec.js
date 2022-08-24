// I get a 500 with this test (at /scheduled_events): 'Uncaught (in promise) SyntaxError: Unexpected token < in JSON at position 0'
// const eventTypeList = [
//   {
//     uri: 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA',
//     name: 'First chat',
//     scheduling_url: 'https://calendly.com/acmesales',
//     description_plain: 'Introductory meeting',
//   },
//   {
//     uri: 'https://api.calendly.com/users/BAAAAAAAAAAAAAAA',
//     name: 'Second chat',
//     scheduling_url: 'https://calendly.com/acmesales',
//     description_plain: 'Follow-up meeting',
//   },
//   {
//     uri: 'https://api.calendly.com/users/CAAAAAAAAAAAAAAA',
//     name: 'Third chat',
//     scheduling_url: 'https://calendly.com/acmesales',
//     description_plain: 'Follow-up to the follow-up meeting',
// //   },
// //   {
// //     uri: 'https://api.calendly.com/users/DAAAAAAAAAAAAAAA',
// //     name: 'Fourth chat',
// //     scheduling_url: 'https://calendly.com/acmesales',
// //   },
// // ]

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
    },
]
  
//   describe('Events tab in dashboard', () => {
//     it('Should route user to page with all scheduled events', () => {
//       cy.intercept(
//         {
//           method: 'GET',
//           url: '/oauth/authorize*',
//         },
//         (req) => {
//           req.redirect(
//             `${
//               Cypress.config().baseUrl
//             }/oauth/callback?code=5BbtpL2SJIeDP4yClOJPHMJZwEDF1QkbPNaJgkTymeI`,
//             302
//           );
//         }
//       );
  
//       cy.intercept(
//         {
//           method: 'GET',
//           url: '/api/event_types',
//         },
//         {
//           eventTypes: []
//         }
//       );

      // cy.intercept(
      //   {
      //       method: 'GET',
      //       url: '/api/scheduled_events*',
      //     },
      //     {
      //       events: scheduledEvents
      //     }
      // )

//       cy.visit('/')
//       cy.get('.btn-large').click();
      // cy.get('nav').contains('Events').click( {force: true })
//       cy.get('.striped centered').contains('Name')
//     });
//   });

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
    custom_questions: [{position: 0, name: 'What would you like the power to do?'}]
  },
]

describe('Dashboard', () => {
it('Should have clickable event-type cards to view event-type details', () => {
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

  // cy.intercept(
  //   {
  //     method: 'GET',
  //     url: '/api/event_types/*',
  //   },
  //   {
  //     eventType: eventTypeList[0]
  //   }
    
  // );

  cy.intercept(
    {
        method: 'GET',
        url: '/api/scheduled_events*',
      },
      {
        events: scheduledEvents
      }
  )

  cy.visit('/login');
  cy.get('.btn-large').click();
  cy.get('nav').contains('Events').click()
})
});
