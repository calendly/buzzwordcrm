const nock = require('nock');
const { CALENDLY_AUTH_BASE_URL, CALENDLY_API_BASE_URL } = process.env;

exports.mockCalendlyAuthentication = () => {
  nock(CALENDLY_AUTH_BASE_URL).persist().post('/oauth/token').reply(200, {
    access_token: 'fakeToken',
    refresh_token: 'refreshToken',
  });

  nock(CALENDLY_API_BASE_URL)
    .persist()
    .get('/users/me')
    .reply(200, {
      resource: {
        uri: 'someuri',
      },
    });
};
