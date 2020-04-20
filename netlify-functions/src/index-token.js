// Demo code how to obtain JWT token
const config = require("./config");
const {getUploadToken} = require("./auth/upload");

const main = async () => {
  const token = await getUploadToken(
    config.AUTH0_DOMAIN,
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_SECRET,
    config.AUTH0_API_IDENTIFIER
  );

  console.log(`token: `, token);
};

main();
