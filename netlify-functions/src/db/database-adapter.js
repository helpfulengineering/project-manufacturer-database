const formatISO = require('date-fns/formatISO');
const log = require('loglevel');
const graphql = require('graphql.js'); // https://github.com/f/graphql.js/
const {GRAPHQL_ENDPOINT} = require("../config");

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
  const doQuery = client(query);

  return doQuery({
    entity_pk
  }).catch(function (error) { // response is originally response.errors of query result
    log.error(`doQuery error: ${error}`);
    throw error;
  });
};


const insertEmailCount = async (client, userId) => {
  const query = `
  mutation insertEmailCount($user_id: String!) {
    insert_email_count(objects: {user_id: $user_id}) {
      affected_rows
      returning {
        pk
      }
    }
  }
  `;
  const doQuery = client(query);
  const result = await doQuery({
    user_id: userId
  });

  return result.insert_email_count.returning[0].pk;
};

const getEmailCount = async (client, userId, sinceDate) => {
  const since = formatISO(sinceDate);

  const query = `
query GetEmailRate($user_id: String!, $since: timestamptz!) {
  email_count_aggregate(
    where: {
      user_id: {_eq: $user_id},
      timestamp: {_gte: $since}
    }
  ) {
    aggregate {
      count
    }
  }
}
  `;
  const doQuery = client(query);
  const result = await doQuery({
    user_id: userId,
    since
  });

  return result.email_count_aggregate.aggregate.count;
};

/**
 * Remove previously set email counter if email not actually send
 * @param id
 */
const removeEmailCount = async (client, count_pk) => {
  const query = `mutation deleteEmailCount($pk: bigint!) {
    delete_email_count(where: {pk: {_eq: $pk}}) {
      affected_rows
    }
  }
  `;
  const doQuery = client(query);
  const result = await doQuery({
    pk: count_pk
  });
  return result.delete_email_count.affected_rows;
};

module.exports = {
  createClient,
  getContactInfo,
  insertEmailCount,
  getEmailCount,
  removeEmailCount,
};
