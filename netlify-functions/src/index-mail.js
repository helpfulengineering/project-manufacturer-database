// Demo code that sends an email
const log = require('loglevel');
const config = require("./config");
const {MAILGUN_DOMAIN} = require("./config");
const {MAILGUN_API_KEY} = require("./config");
const {createMailgun} = require("./email/adapter");
const {sendEmail} = require("./email/adapter");

log.setLevel(log.levels.TRACE);

const main = async () => {
  if (process.argv.length != 3) {
    console.error('provided target email as first argument');
    throw "fail";
  }

  const toEmail = process.argv[2];
  console.log(`toEmail: `, toEmail);

  const mg = createMailgun(MAILGUN_API_KEY, MAILGUN_DOMAIN);
  await sendEmail(mg, {
    fromName: 'John Doe',
    fromEmail: 'john@example.com',
    toName: 'Kate',
    message: 'Hi, we would like to use your 3D printer for printing PPE for our hospital. Please let me know if you can help',
    toEmail,
  });

  console.log('end of main');
};

main();
console.log('end of script');
