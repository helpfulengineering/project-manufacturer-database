const sanitizeHtml = require('sanitize-html');

const sanitizeInputs = (params) => {
  const fromName = sanitizeHtml(params.from_name);
  const fromEmail = params.from_email;
  const entityPk = params.to_entity_pk;
  const message = sanitizeHtml(params.message);
  return {
    fromName,
    fromEmail,
    entityPk,
    message
  }
};

module.exports = {
  sanitizeInputs
};
