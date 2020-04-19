const dotenv = require("dotenv");

if (process.env.NODE_ENV !== 'production') {
  //loads environment variables from a .env file into process.env
  dotenv.config();
}

const GRAPHQL_ENDPOINT = 'https://he-manufacturers-db-hasura.herokuapp.com/v1/graphql';

module.exports = {
  GRAPHQL_ENDPOINT,
  UPLOAD_CLIENT_CREDENTIAL_DOMAIN: process.env.UPLOAD_CLIENT_CREDENTIAL_DOMAIN,
  UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID: process.env.UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID,
  UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET: process.env.UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET,
  UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER: process.env.UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER,
};
