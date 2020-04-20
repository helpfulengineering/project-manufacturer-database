// Demo code that ups email send rate limit
const log = require('loglevel');
const config = require("./config");
const {tryIncreaseCount} = require("./email/rate-limiter");
const {createClient} = require("./db/database-adapter");
const {getUploadToken} = require("./auth/upload");

log.setLevel(log.levels.TRACE);

const main = async () => {
  if (process.argv.length != 3) {
    console.error('provided user id as first argument');
    throw "fail";
  }

  const userId = process.argv[2];
  console.log(`userId: `, userId);

  const writeToken = await getUploadToken(
    config.AUTH0_DOMAIN,
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_SECRET,
    config.AUTH0_API_IDENTIFIER
  );
  log.info('GraphQL auth token retrieved');

  const client = createClient(writeToken);

  await tryIncreaseCount(client, userId, config.EMAIL_RATE_LIMIT.DEFAULT);

  console.log('end of main');
};

main();
console.log('end of script');
