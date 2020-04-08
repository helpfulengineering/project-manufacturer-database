Programming that moves data from google sheets into database through GraphQL API.

## Getting Started

### Installing

    npm install

### Config

Set environment variables, either directly or through `.env` file:

```
DOC_API_KEY=<GoogleDocApiKey>
UPLOAD_CLIENT_CREDENTIAL_DOMAIN=<key>
UPLOAD_CLIENT_CREDENTIAL_CLIENT_ID=<key>
UPLOAD_CLIENT_CREDENTIAL_CLIENT_SECRET=<key>
UPLOAD_CLIENT_CREDENTIAL_API_IDENTIFIER=<key>
GOOGLE_PRIVATE_KEY="<key_contents_notice_quotes>"
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service_email>
```

Note the `.env` file will not work in production (by design).
    
### Run

    node index.js
    
## Misc

To get the graphql schema use:

```
npnx apollo schema:download --endpoint https://hasura-test-manufacturers-db.herokuapp.com/v1/graphql --header 'X-Hasura-Admin-Secret: adminsecretkey'
```

Note, don't forget to fill in the `adminsecretkey`.
