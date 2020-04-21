const dotenv = require('dotenv');
const {parseRowCrowdSourceDoc, parseRowFabEquipDoc} = require('./parser/parsers.js');
const exit_codes = require('./exit_codes.js');

if (process.env.NODE_ENV !== 'production') {
  //loads environment variables from a .env file into process.env
  dotenv.config();
}

const getEnvVariable = (name) => {
  const variable = process.env[name];
  if (!variable) {
    console.error(`missing env variable: "${name}"`);
    process.exit(exit_codes.MISSING_ENV_VAR);
  }
  return variable;
};

//
// Spreadsheet and Google config
//
const GOOGLE_AUTH = {
  client_email: getEnvVariable('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
  private_key: getEnvVariable('GOOGLE_PRIVATE_KEY')
};

const Copy3DPrinterCrowdCovidDoc = {
  spreadsheetId: '1Kaz6TiZd4celNXAyz4g9n5q6GEypjGS85nNQL5EjnXg',
  sheetId: '2009239893',
  rowParser: parseRowCrowdSourceDoc,
};

const FabricationEquipmentDoc = {
  spreadsheetId: '1t3UVO1YkxWyhBxVFT-uMTBt4iTljawjjs_iTuS8W6yE/',
  sheetId: '1994893053',
  rowParser: parseRowFabEquipDoc,
};

//
// GraphQL and Hasura config
//
const GRAPHQL_URI = 'https://he-manufacturers-db-hasura.herokuapp.com/v1/graphql';

module.exports = {
  GOOGLE_AUTH,
  Copy3DPrinterCrowdCovidDoc,
  FabricationEquipmentDoc,
  GRAPHQL_URI,
};
