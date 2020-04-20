class AuthError extends Error {} // authentication or authorization error
class RateError extends Error {} // rate limit exceeded

module.exports = {
  AuthError,
  RateError
};
