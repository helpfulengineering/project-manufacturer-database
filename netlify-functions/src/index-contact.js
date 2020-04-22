// Demo code how to obtain get specific contact info
const log = require('loglevel');
const config = require("./config");
const {createClient, getContactInfo} = require("./db/database-adapter");
const {getWriteToken} = require("./auth/upload");

log.setLevel(log.levels.TRACE);

const main = async () => {
  const entity_pk = 65218; // valid email

  const authToken = await getWriteToken(
    config.AUTH0_DOMAIN,
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_SECRET,
    config.AUTH0_API_IDENTIFIER
  );
  log.info('GraphQL auth token retrieved');

  const client = createClient(authToken);
  const info = await getContactInfo(client, entity_pk);
  console.log(JSON.stringify(info));
};

main();
