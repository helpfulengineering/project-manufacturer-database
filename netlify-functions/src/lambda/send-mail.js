const log = require('loglevel');
const config = require("../config");
const {createClient} = require("../db/database-adapter");
const {getWriteToken} = require("../auth/upload");
const {RateError} = require("../errors");
const {tryIncreaseCount} = require("../email/rate-limiter");
const {verifyJwt} = require("../auth/check-jwt");
const {extractToken} = require("../auth/check-jwt");
const {AuthError} = require("../errors");
import querystring from "querystring";

log.setLevel(log.levels.TRACE);

const PEM = config.AUTH0_PEM;
const auth0Domain = config.AUTH0_DOMAIN;

const StatusCodes = {
  unauthorized: 401,
  rate_limit: 429, // The response representations SHOULD include details explaining the condition
};

const checkVarDefined = (value, name) => {
  if (!value) {
    log.error(`missing env variable ${name}`);
    throw new Error(`Server env variable not configured ${name}`);
  }
};

const getClient = async () => {
  const writeToken = await getWriteToken(
    config.AUTH0_DOMAIN,
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_SECRET,
    config.AUTH0_API_IDENTIFIER
  );
  log.info('GraphQL auth token retrieved');

  return createClient(writeToken);
};

export async function handler(event, context) {
  checkVarDefined(PEM, 'AUTH0_PEM');
  checkVarDefined(auth0Domain, 'AUTH0_DOMAIN');
  checkVarDefined(auth0Domain, 'AUTH0_CLIENT_ID');
  checkVarDefined(auth0Domain, 'AUTH0_CLIENT_SECRET');
  checkVarDefined(auth0Domain, 'AUTH0_API_IDENTIFIER');

  if (event.httpMethod !== "POST") {
    // Only allow POST
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Check authorization
  log.info('checking authorization');
  const { authorization } = event.headers;
  let decoded;
  try {
    const token = extractToken(authorization);
    decoded = await verifyJwt(token, auth0Domain, PEM);
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        statusCode: StatusCodes.unauthorized,
        body: e.message
      };
    } else {
      throw e;
    }
  }

  // Get user id

  const claims = decoded['https://hasura.io/jwt/claims'];
  const userId = claims['x-hasura-user-id'];
  log.info(`user id: ${userId}`);

  const params = querystring.parse(event.body);
  const fromName = params.from_name;
  // TODO validate form fields

  console.log(params);
  console.log(fromName);

  // Get GraphQL client
  log.info('initializing graphQl client');
  const client = await getClient();
  let countPk;
  try {
    countPk = await tryIncreaseCount(client, userId, config.EMAIL_RATE_LIMIT.DEFAULT);
  } catch (e) {
    if (e instanceof RateError) {
      return {
        statusCode: StatusCodes.rate_limit,
        body: e.message
      };
    } else {
      throw e;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      fromName,
      message: `Hello world ${Math.floor(Math.random() * 10)}`
    })
  };
}
