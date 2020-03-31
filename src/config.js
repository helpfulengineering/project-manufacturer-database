// Auth (Auth0)
export const domain = 'dev-oimr17za.eu.auth0.com';
export const client_id = 'LT1w4ffmi2pkmvkdvdoS1yuQwtmmrvYu'; //public information
export const apiAudienceIdentifier = 'HasuraLink';

// Custom auth values, configuration is done in Auth0 dashboard.
// These roles match the roles used in Hasura for permissions.
export const ROLES = {
  USER: 'user', // default
  USER_MANAGER: 'user-manager',
};

// API KEY for Google Geocode and GeoLocation APIs
// See README for development usage
const devKey = window.localStorage && window.localStorage.getItem('HE_DB_SEARCH_DEV_API_KEY');
if (devKey) {
  console.log('Development API key found, using that for Google API calls');
}
// API key is for production use only.
export const API_KEY = devKey || 'AIzaSyDnNSecPko3v4LyfYrIjJRxyPLQvRbrbzY'; // DO NOT CHANGE FOR DEVELOPMENT, use localstorage
export const GRAPHQL_ENDPOINT = 'https://hasura-test-manufacturers-db.herokuapp.com/v1/graphql';

export const PROJECT_SLACK_CHANNEL = '#project-manufacturer-database';

// Max number of records we will return to a user
export const MAX_QUERY_SIZE = 500;
