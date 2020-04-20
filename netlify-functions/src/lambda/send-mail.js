const log = require('loglevel');
const config = require("../config");
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

export async function handler(event, context) {
  checkVarDefined(PEM, 'AUTH0_PEM');
  checkVarDefined(auth0Domain, 'AUTH0_DOMAIN');

  if (event.httpMethod !== "POST") {
    // Only allow POST
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Check authorization
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
  console.log(decoded);

  const params = querystring.parse(event.body);
  const fromName = params.from_name;

  console.log(event);

  const token = event.authorizationToken;
  console.log(`token: ${token}`);

  console.log(params);
  console.log(fromName);

  // TODO: throw unauthenticated
  // TODO: throw unauthorized
  // TODO: throw rate limit

  // const payload = JSON.parse(event)

  return {
    statusCode: 200,
    body: JSON.stringify({
      fromName,
      message: `Hello world ${Math.floor(Math.random() * 10)}`
    })
  };
}
