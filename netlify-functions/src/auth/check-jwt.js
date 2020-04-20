const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

async function getPem(tenant) {
  const uri = `https://${tenant}/pem`;
  const pem = await fetch(uri)
    .then(res => res.text());
  return pem;
}

const verifyJwt = async (token, pem, validations) => {
  const decoded = jwt.verify(token, pem, { // throws error if not valid
    algorithms: ['RS256'],
    ...validations
  });
  return decoded;
};

module.exports = {
  verifyJwt
};
