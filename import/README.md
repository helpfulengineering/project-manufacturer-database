Programming that moves data from google sheets into database through GraphQL API.

## Getting Started

### Installing

    npm install

### Config

Set environment variables, either directly or through `.env` file:

```
DOC_API_KEY=<GoogleDocApiKey>
```

Note the `.env` file will not work in production (feature).
    
### Run

    node index.js
    
## Misc

To get the graphql schema use:

```
npnx apollo schema:download --endpoint https://hasura-test-manufacturers-db.herokuapp.com/v1/graphql --header 'X-Hasura-Admin-Secret: adminsecretkey'
```

Note, don't forget to fill in the `adminsecretkey`.
