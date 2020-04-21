const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const {AuthError} = require("../errors");

const extractToken = authorizationHeader => {
  if (authorizationHeader && authorizationHeader.includes('Bearer ')) {
    return authorizationHeader.slice(7);
  } else if (authorizationHeader) {
    throw new AuthError('Authorization bearer missing');
  } else {
    throw new AuthError('Authorization header missing');
  }
};

async function getPem(tenant) {
  const uri = `https://${tenant}/pem`;
  const pem = await fetch(uri)
    .then(res => res.text());
  return pem;
}

const verifyJwt = async (token, domain, pem) => {
  const decoded = jwt.verify(token, pem, { // throws error if not valid
    algorithms: ['RS256'],
    audience: 'HasuraLink',
    issuer: `https://${domain}/`,
    algorithms: ['RS256']
  });
  return decoded;
};

module.exports = {
  extractToken,
  verifyJwt
};
