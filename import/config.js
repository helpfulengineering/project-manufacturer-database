import dotenv from "dotenv";
import {parseRowCrowdSourceDoc, parseRowFabEquipDoc} from "./parsers.js";
import exit_codes from "./exit_codes.js";

if (process.env.NODE_ENV !== 'production') {
  //loads environment variables from a .env file into process.env
  dotenv.config();
}

//
// Spreadsheet and Google config
//
export const DOC_API_KEY = process.env.DOC_API_KEY;
if (!DOC_API_KEY) {
  console.error('missing API key, set env variable "DOC_API_KEY"');
  process.exit(exit_codes.MISSING_API_KEY);
}

export const Copy3DPrinterCrowdCovidDoc = {
  spreadsheetId: '1Kaz6TiZd4celNXAyz4g9n5q6GEypjGS85nNQL5EjnXg',
  sheetId: '2009239893',
  rowParser: parseRowCrowdSourceDoc,
};

export const FabricationEquipmentDoc = {
  spreadsheetId: '1t3UVO1YkxWyhBxVFT-uMTBt4iTljawjjs_iTuS8W6yE/',
  sheetId: '1994893053',
  rowParser: parseRowFabEquipDoc,
};

//
// GraphQL and Hasura config
//
export const GRAPHQL_URI = 'https://he-manufacturers-db-hasura.herokuapp.com/v1/graphql';
