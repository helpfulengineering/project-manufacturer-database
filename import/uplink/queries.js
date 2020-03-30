// Hack to import a file as plaintext... https://stackoverflow.com/a/60849354
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
require('graphql-import-node/register');

export const InsertQuery = require('./insert.graphql');
