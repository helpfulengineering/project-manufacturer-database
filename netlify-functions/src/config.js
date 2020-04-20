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

const EMAIL_RATE_LIMIT = {
  DEFAULT: 5 // PER_USER_PER_24H
};

module.exports = {
  EMAIL_RATE_LIMIT,
  GRAPHQL_ENDPOINT,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_API_IDENTIFIER: process.env.AUTH0_API_IDENTIFIER,

  AUTH0_PEM: process.env.AUTH0_PEM,
};