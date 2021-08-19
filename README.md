# BuzzwordCRM

BuzzwordCRM is a sample application that demonstrates how to build applications using Calendly's v2 api.

## Running the app locally

1. Register as a Calendly developer (if you haven't already) by logging into your Calendly account and [completing this form](https://docs.google.com/forms/d/e/1FAIpQLSc9ltoPU9I_yyQt1gWLm6fa0xMhpPWm-mL_vfPfeilC_s1vTA/viewform) (note: this app assumes that your redirect uri will be http://localhost:3000/oauth/callback). We’ll process your request within 1 day and email you when it’s time to complete the setup.
1. Once you've received your Client ID and Client Secret you can then copy `.env.example` to `.env` and update the file's environment variables with your application's credentials. You can update the redirect URL in this file as well.

   ```bash
   cp .env.example .env
   ```

1. Run `npm install` to install dependencies.
1. Run `npm start` to start the application.
1. Navigate to `http://localhost:3000`.

