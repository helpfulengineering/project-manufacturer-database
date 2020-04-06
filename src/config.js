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

// API key is for production use only.
export const GRAPHQL_ENDPOINT = 'https://he-manufacturers-db-hasura.herokuapp.com/v1/graphql';

export const PROJECT_SLACK_CHANNEL = '#project-manufacturer-database';

// Max number of records we will return to a user
export const MAX_QUERY_SIZE = 500;

export const POSTHOG_API_HOST = 'https://he-manufacturers-db-posthog.herokuapp.com';
export const POSTHOG_TOKEN = "EpakFOux3Zm3hBrw46z3UNgEUJtA-FMbFgCgkCBMEkc";
