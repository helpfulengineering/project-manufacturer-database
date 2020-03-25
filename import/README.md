Programming that moves data from google sheets into database through GraphQL API.

## Getting Started

### Installing

    npm install

### Get schema

```
npnx apollo schema:download --endpoint https://my-graphql-engine.com/v1/graphql --header 'X-Hasura-Admin-Secret: adminsecretkey'
```

### Credentials

Set `local/api_key` to a google spreadsheet API key.
    
### Run



    node index.js
    
