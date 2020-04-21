class AuthError extends Error {} // authentication or authorization error
class RateError extends Error {} // rate limit exceeded
class FormError extends Error {} // input params error
class MailError extends Error {}

module.exports = {
  AuthError,
  RateError,
  FormError,
  MailError
};
