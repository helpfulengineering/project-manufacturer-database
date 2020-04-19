// Demo code how to obtain JWT token
const config = require("./config");
const {getUploadToken} = require("./auth/upload");

const main = async () => {
  const token = await getUploadToken(
    config.UPLOAD_CLIENT_CREDENTIAL_DOMAIN,
    config.UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID,
    config.UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET,
    config.UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER
  );

  console.log(`token: `, token);
};

main();
