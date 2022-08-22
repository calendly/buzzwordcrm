//Get a failed to fetch error with this test
const eventTypeList = [
  // "collection" : [
    {
      uri: 'https://api.calendly.com/event_types/ABBBAAAAAAAAAAAAAA',
      name: 'First chat',
      active: true,
      scheduling_url: 'https://calendly.com/acmesales',
      duration: 30,
      kind: 'solo',
      last_updated: '2019-08-07T06:05:04.321123Z',
      description_plain: 'Introductory meeting',
      custom_questions: [{position: 0}]
    },
    // {
    //   uri: 'https://api.calendly.com/event_types/BAAAAAAAAAAAAAAA',
    //   name: 'Second chat',
    //   active: true,
    //   scheduling_url: 'https://calendly.com/acmesales',
    //   duration: 30,
    //   kind: 'solo',
    //   last_updated: '2019-08-07T06:05:04.321123Z',
    //   description_plain: 'Follow-up meeting',
    //   custom_questions: [{position: 0}]
    // },
    // {
    //   uri: 'https://api.calendly.com/event_types/CAAAAAAAAAAAAAAA',
    //   name: 'Third chat',
    //   active: false,
    //   scheduling_url: 'https://calendly.com/acmesales',
    //   duration: 30,
    //   kind: 'solo',
    //   last_updated: '2019-08-07T06:05:04.321123Z',
    //   description_plain: 'Follow-up to the follow-up meeting',
    //   custom_questions: [{position: 0}]
    // },
    // {
    //   uri: 'https://api.calendly.com/event_types/DAAAAAAAAAAAAAAA',
    //   name: 'Fourth chat',
    //   active: true,
    //   scheduling_url: 'https://calendly.com/acmesales',
    //   duration: 30,
    //   kind: 'solo',
    //   last_updated: '2019-08-07T06:05:04.321123Z',
    //   custom_questions: [{position: 0}]
    // },
  // ]  
  ]

  // const eventType = {
  //   uri: 'https://api.calendly.com/event_types/ABBBAAAAAAAAAAAAAA',
  //   name: 'First chat',
  //   active: true,
  //   scheduling_url: 'https://calendly.com/acmesales',
  //   duration: 30,
  //   kind: 'solo',
  //   last_updated: '2019-08-07T06:05:04.321123Z',
  //   description_plain: 'Introductory meeting',
  //   custom_questions: [{position: 0}]
  // }

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
        eventTypes: eventTypeList
      }
      
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/event_types/*',
      },
      {
        eventType: eventTypeList[0]
      }
      
    );

    cy.visit('/');
    cy.get('.btn-large').click();
    cy.log('eventType')
    cy.get('.card-content').click({ force: true })
    cy.get('h5').contains('First chat')
  })
});
