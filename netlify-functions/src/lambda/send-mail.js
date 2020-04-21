const log = require('loglevel');
const {createMailgun} = require("../email/adapter");
import querystring from "querystring";

const config = require("../config");
const {sanitizeInputs} = require("../input/sanitize");
const {sendEmail} = require("../email/adapter");
const {validateEmail} = require("../input/form_validation");
const {FormError} = require("../errors");
const {removeCount} = require("../email/rate-limiter");
const {getContactInfo} = require("../db/database-adapter");
const {validateFormParams} = require("../input/form_validation");
const {createClient} = require("../db/database-adapter");
const {getWriteToken} = require("../auth/upload");
const {RateError} = require("../errors");
const {tryIncreaseCount} = require("../email/rate-limiter");
const {verifyJwt} = require("../auth/check-jwt");
const {extractToken} = require("../auth/check-jwt");
const {AuthError} = require("../errors");

log.setLevel(log.levels.TRACE);

const StatusCodes = {
  bad: 400,
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
  checkVarDefined(config.AUTH0_PEM, 'AUTH0_PEM');
  checkVarDefined(config.AUTH0_DOMAIN, 'AUTH0_DOMAIN');
  checkVarDefined(config.AUTH0_CLIENT_ID, 'AUTH0_CLIENT_ID');
  checkVarDefined(config.AUTH0_CLIENT_SECRET, 'AUTH0_CLIENT_SECRET');
  checkVarDefined(config.AUTH0_API_IDENTIFIER, 'AUTH0_API_IDENTIFIER');
  checkVarDefined(config.MAILGUN_API_KEY, 'MAILGUN_API_KEY');
  checkVarDefined(config.MAILGUN_DOMAIN, 'MAILGUN_DOMAIN');

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
    decoded = await verifyJwt(token, config.AUTH0_DOMAIN, config.AUTH0_PEM);
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

  //Form validation
  const params = querystring.parse(event.body);
  if (params.do_not_fill) { // Hidden field in front-end, low hanging fruit bot prevention.
    return {
      statusCode: StatusCodes.unauthorized,
      body: 'do not fill'
    };
  }
  try {
    validateFormParams(params);
  } catch (e) {
    if (e instanceof FormError) {
      return {
        statusCode: StatusCodes.bad,
        body: e.message
      };
    } else {
      throw e;
    }
  }

  const {
    fromName,
    fromEmail,
    entityPk,
    message
  } = sanitizeInputs(params);

  // Get user id
  const claims = decoded['https://hasura.io/jwt/claims'];
  const userId = claims['x-hasura-user-id'];
  log.info(`user id: ${userId}`);

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
  log.info('increased counter on rate limit');

  try {
    log.info('getting contact info...');
    const targetInfo = await getContactInfo(client, entityPk);
    log.info(`contact info fetched: ${JSON.stringify(targetInfo)}`);

    validateEmail(targetInfo.email);

    log.info(`sending mail to ${targetInfo.email}...`);
    const mg = createMailgun(config.MAILGUN_API_KEY, config.MAILGUN_DOMAIN);
    await sendEmail(mg, {
      fromName,
      fromEmail,
      toEmail: targetInfo.email,
      toName: targetInfo.name,
      message
    });
    log.info('mail sent through adapter!');
  } catch (e) {
    log.error('unexpected error after counting towards rate limit, removing count');
    await removeCount(client, countPk);
    log.info('rate limit count removed');

    if (e instanceof FormError) {
      log.error('Entity does not have valid email');
      return {
        statusCode: 501,
        body: 'Entity does not have valid email'
      };
    } else {
      throw e;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
    })
  };
}
