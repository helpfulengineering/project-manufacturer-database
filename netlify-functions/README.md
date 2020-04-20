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
```

Note the `.env` file will not work in production (by design).

## Run

To test Netlify functions:

    npm start
    
Functions are served on http://localhost:9000/

e.g.: 

http://localhost:9000/.netlify/functions/your-function-name

### Try it out code directly

The various `src/index-*.js` files will run modules in isolation.
Run them from the project root with the necessary environment variables set. 

## Notes

Using this Graphql client: https://github.com/f/graphql.js/