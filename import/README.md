Programming that moves data from google sheets into database through GraphQL API.

## Getting Started

### Installing

    npm install

### Config

Set `local/api_key` to a google spreadsheet API key.

Create a config file:

    cp local/config_example.js local/config.js

And fill in de `config.js` file.
    
### Run

    node index.js
    
## Misc

To get the graphql schema use:

```
npnx apollo schema:download --endpoint https://my-graphql-engine.com/v1/graphql --header 'X-Hasura-Admin-Secret: adminsecretkey'
```
