const fs = require('fs');

require.extensions['.graphql'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const InsertQuery = require('./insert.graphql');

module.exports = {
  InsertQuery
};

