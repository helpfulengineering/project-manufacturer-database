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
UPLOAD_CLIENT_CREDENTIAL_DOMAIN=<key>
UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID=<key>
UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET=<key>
UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER=<key>
```

Note the `.env` file will not work in production (by design).

## Run

    npm start
    
Functions are served on http://localhost:9000/

e.g.: 

http://localhost:9000/.netlify/functions/your-function-name


## Notes

Using this Graphql client: https://github.com/f/graphql.js/
