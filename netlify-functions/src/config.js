const dotenv = require("dotenv");

if (process.env.NODE_ENV !== 'production') {
  //loads environment variables from a .env file into process.env
  if (process.env.NODE_ENV == 'dev') {
    // when run through netlify-lambda the cwd is <project_root>/netlify-functions/
    dotenv.config('../.env');
  } else {
    dotenv.config(); // use default: '<cwd>/.env'
  }
}

const GRAPHQL_ENDPOINT = 'https://he-manufacturers-db-hasura.herokuapp.com/v1/graphql';

const SITE_URL = 'https://manucor.helpfulengineering.org';

const EMAIL_RATE_LIMIT = {
  DEFAULT: 3 // PER_USER_PER_24H
};

module.exports = {
  EMAIL_RATE_LIMIT,
  GRAPHQL_ENDPOINT,
  SITE_URL,
  MOCK_EMAIL: process.env.MOCK_EMAIL !== undefined,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_API_IDENTIFIER: process.env.AUTH0_API_IDENTIFIER,
  AUTH0_PEM: process.env.AUTH0_PEM.replace(/\\n/g, '\n'), // https://stackoverflow.com/a/36439803
  MAILGUN_HOST: process.env.MAILGUN_HOST || 'api.mailgun.net', // Needs to be set for EU region, see https://www.npmjs.com/package/mailgun-js#options
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
};
