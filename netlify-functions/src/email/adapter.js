const log = require('loglevel');
const mailgun = require('mailgun-js');
const {MailError} = require("../errors");
const {composeMail} = require("./mail");

const createMailgun = (apiKey, domain) => mailgun({
  apiKey,
  domain
});

const sendEmail = (mg, { fromEmail, fromName, toEmail, toName, message }) => {
  const { body, subject } = composeMail({fromName, toName, message});

  const data = {
    from: `Manucor - Helpful Engineering <no-reply@${mg.domain}>`,
    'h:Reply-To': fromEmail,
    to: toEmail,
    subject: subject,
    text: body
  };

  return mg.messages().send(data)
    .then(body => {
      log.info('mail sent: ', body);
      return body;
    }, err => {
      log.error(`error sending email: ${err}`);
      throw new MailError('Problem sending mail through mail service');
    });
};

module.exports = {
  createMailgun,
  sendEmail
};
