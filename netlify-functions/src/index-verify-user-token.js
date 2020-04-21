// Demo code how to verify user JWT token
const config = require("./config");
const {verifyJwt} = require("./auth/check-jwt");

const main = async () => {
  if (process.argv.length != 3) {
    console.error('provided token as first argument');
    throw "fail";
  }

  const token = process.argv[2];
  console.log(`token: `, token);

  const pem = config.AUTH0_PEM;
  const auth0Domain = config.AUTH0_DOMAIN;
  const decoded = await verifyJwt(token, auth0Domain, pem);

  console.log(decoded);
};

main();
