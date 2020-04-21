const validate = require('validate.js');

const isEmail = value => {
  return !validate.single(value, {presence: true, email: true});
};

module.exports = {
  isEmail
};
