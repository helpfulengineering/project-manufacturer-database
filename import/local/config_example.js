import {parseRowCrowdSourceDoc, parseRowFabEquipDoc} from "../parsers.js";

export const GRAPHQL_URI = 'graphql-endpoint';

export const Copy3DPrinterCrowdCovidDoc = {
  spreadsheetId: 'spreadsheetid',
  sheetId: 'sheetid',
  rowParser: parseRowCrowdSourceDoc,
};

export const FabricationEquipmentDoc = {
  spreadsheetId: 'spreadsheetid',
  sheetId: 'sheetid',
  rowParser: parseRowFabEquipDoc,
};
