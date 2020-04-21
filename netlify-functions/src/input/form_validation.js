const validate = require("validate.js");
const {FormError} = require("../errors");

// see https://validatejs.org/#constraints
const constraints = {
  from_name: {
    presence: true,
    length: {minimum: 1, maximum: 24}
  },
  from_email: {
    presence: true,
    email: true
  },
  to_entity_pk: {
    presence: true,
    numericality: {
      onlyInteger: true
    }
  },
  message: {
    presence: true,
    length: { minimum: 80, maximum: 2000 }
  }
};

const validateFormParams = (params) => {
  const result = validate(params, constraints);
  if (result) {
    throw new FormError(`form params not validated: ${JSON.stringify(result)}`);
  }
};

const validateEmail = email => {
  const result = validate.single(email, {presence: true, email: true});
  if (result) {
    throw new FormError(`email not valid: ${JSON.stringify(result)}`);
  }
};

module.exports = {
  validateEmail,
  validateFormParams
};
