const validate = require("validate.js");
const {FormError} = require("../errors");

// see https://validatejs.org/#constraints
const constraints = {
  from_name: {
    presence: true,
    length: {minimum: 1}
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
  }
};

const validateFormParams = (params) => {
  const result = validate(params, constraints);
  if (result) {
    throw new FormError(`form params not validated: ${JSON.stringify(result)}`);
  }
};

module.exports = {
  validateFormParams
};
