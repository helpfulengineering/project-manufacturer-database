# volunteer manufacturer Netlify functions 

Creation of functions used to send email to manufacturing volunteers.
Functions are serverless Netlify (lambda like) functions. 

Master is deployed to: https://he-local-manufacturer-functions.netlify.app/

Using Netlify-lambda does some magic behind the scenes.
For instance a default webpack/babel config is used, see: https://github.com/netlify/netlify-lambda.


## install

   npm install


## Config

Set environment variables, either directly or through `.env` file:

```
AUTH0_DOMAIN=<key>
AUTH0_CLIENT_ID=<key>
AUTH0_CLIENT_SECRET=<key>
AUTH0_API_IDENTIFIER=<key>
AUTH0_PEM="raw text from https://${AUTH0_DOMAIN}/pem" (note the quotes!)
MAILGUN_DOMAIN=<domain, the p.s.: sandbox one is for testing only>
MAILGUN_API_KEY=<private key>
```

Note the `.env` file will not work in production (by design).

If you don't want to actually send emails set the var: `MOCK_EMAIL`.

## Run

To test Netlify functions:

    npm start
    
Functions are served on http://localhost:9000/

e.g.: 

http://localhost:9000/.netlify/functions/your-function-name

## Test

    npm test

### Try it out code directly

The various `src/index-*.js` files will run modules in isolation.
Run them from the project root with the necessary environment variables set. 

## Notes

Using this Graphql client: https://github.com/f/graphql.js/
