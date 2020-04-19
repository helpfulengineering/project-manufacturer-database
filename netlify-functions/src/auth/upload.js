const rp = require('request-promise');

const getUploadToken = async (domain, client_id, client_secret, audience) => {
  const url = `https://${domain}/oauth/token`;
  const options = {
    method: 'POST',
    url,
    json: true,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: {
      grant_type: 'client_credentials',
      client_id,
      client_secret,
      audience
    }
  };

  return rp(options)
    .then(response => response.access_token);
};

module.exports = {
  getUploadToken
};
