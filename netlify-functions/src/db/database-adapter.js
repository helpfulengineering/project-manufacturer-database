const log = require('loglevel');
const graphql = require('graphql.js'); // https://github.com/f/graphql.js/
const {GRAPHQL_ENDPOINT} = require("../config");

const query = `
query GetContact($entity_pk: bigint!) {
  Entity(where: {pk: {_eq: $entity_pk}}) {
    contacts {
      email
    }
    name
  }
}
`;

const createClient = (token) => {
  return graphql(GRAPHQL_ENDPOINT, {
    asJSON: true,
    headers: {
      "User-Agent": "node",
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const getContactInfo = async (client, entity_pk) => {
  const doQuery = client(query);

  return doQuery({
    entity_pk
  }).catch(function (error) { // response is originally response.errors of query result
    log.error(`doQuery error: ${error}`);
    throw error;
  });
};

module.exports = {
  createClient,
  getContactInfo
};
