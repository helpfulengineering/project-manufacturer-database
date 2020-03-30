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

// Add API KEY for Google Geocode and GeoLocation APIs
export const API_KEY = '';
export const GRAPHQL_ENDPOINT = 'https://hasura-test-manufacturers-db.herokuapp.com/v1/graphql';

export const PROJECT_SLACK_CHANNEL = '#project-manufacturer-database';
