# BuzzwordCRM

BuzzwordCRM is a sample application that demonstrates how to build applications using Calendly's v2 api.

## Running the app locally

1. Register as a Calendly developer (if you haven't already) by logging into your Calendly account and [Create a developer account](https://developer.calendly.com/create-a-developer-account) (note: this app assumes that your redirect uri will be http://localhost:3000/oauth/callback).
1. Once you've received your Client ID and Client Secret you can then copy `.env.example` to `.env` and update the file's environment variables with your application's credentials. You can update the redirect URL in this file as well.

   ```bash
   cp .env.example .env
   ```

1. Run `npm install` to install dependencies.
1. Run `npm run dev` to start the application.
1. Navigate to `http://localhost:3000`.

## Tests

BuzzwordCRM is equipped with integration tests, built with [Cypress](https://www.cypress.io/). To run tests locally you can run `npm run test`, this starts a test server and then opens the Cypress runner.
