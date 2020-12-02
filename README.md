# Using Node.js and the Verify API for Step-up Authentication

This repo contains the example code for our [tutorial](https://developer.nexmo.com/verify/tutorials/step-up-authentication/introduction/node) on using the Vonage Verify API to authenticate a user by their mobile phone number. It is written in Node.js using the Express framework.

## Installing your own version
Follow these steps to get your own version of this up and running:

```bash
git clone https://github.com/nexmo-community/node-stepup-auth.git
cd node-stepup-auth && npm install
```

## Configuring the application
Once installed, copy the `.env-example` file to `.env` in the application's root directory. Enter your API key and secret from the [Developer Dashboard](https://dashboard.nexmo.com) and also a name for your application which will appear on the home page and also in the `from` field of any SMS sent via the Verify API.

```
VONAGE_API_KEY=YOUR NEXMO API KEY
VONAGE_API_SECRET=YOUR NEXMO API SECRET
VONAGE_BRAND_NAME=UP TO 11 ALPHANUMERIC CHARACTERS
```
## Running the application
You should then be able to run the app with `npm start`. Open `http://localhost:3000` in your browser to begin.
