const rp = require('request-promise');

const getUploadToken = async () => {
  const url = `https://${process.env.UPLOAD_CLIENT_CREDENTIAL_DOMAIN}/oauth/token`;
  const options = {
    method: 'POST',
    url,
    json: true,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID,
      client_secret: process.env.UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET,
      audience: process.env.UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER
    }
  };

  return rp(options)
    .then(response => response.access_token);
};

module.exports = {
  getUploadToken
};
