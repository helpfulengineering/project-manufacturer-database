import google from "google-spreadsheet";
import log  from "loglevel";
import fs from 'fs';
import {createClient, uploadData} from "./uplink/client.js";
import {Copy3DPrinterCrowdsourcingCovid19} from "./local/sheets.js";
import {GRAPHQL_URI} from "./local/local_config.js";
const GoogleSpreadsheet = google.GoogleSpreadsheet;

const API_KEY_PATH = 'local/api_key';
const apiKey = fs.readFileSync(API_KEY_PATH, "utf8");

const spreadsheetId = Copy3DPrinterCrowdsourcingCovid19.spreadsheetId;
const sheetId = Copy3DPrinterCrowdsourcingCovid19.sheetId;

log.setLevel(log.levels.TRACE);

const client = createClient(GRAPHQL_URI);

const parseRow = (row) => {
  const equipment = {
    model: row['What.type.of.3D.printer.do.you.have.'],
    quantity: 1,
  };

  const site = {
    equipments: [equipment],
    city: row['City'],
    country: row['Country'],
    lat: parseFloat(row['Latitude']),
    lng: parseFloat(row['Longitude']),
  };

  const entity = {
    name: row['Name'],
    sites: [site],
    experience: row['What.type.of.3D.printing.experience.do.you.have.'],
  };

  return entity;
};

const loadRows = async (sheet, limit=1, offset=0) => {
  const rows = await sheet.getRows({ limit, offset }); // can pass in { limit, offset }

  const entities = [];
  for (let i=0; i< rows.length; ++i) {
    const row = rows[i];
    log.debug(`loading row ${i}`);
    const entity = parseRow(row);
    entities.push(entity);
  }

  uploadData(entities);
};

const doImport = async () => {
  // spreadsheet key is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useApiKey(apiKey);

  await doc.loadInfo(); // loads document properties and worksheets
  log.info(`document title: ${doc.title}`);

  const sheet = doc.sheetsById[sheetId];
  log.info(`sheet: ${sheet.title}`);
  log.info(`rows: ${sheet.rowCount}`);

  await loadRows(sheet,1, 0);
};

doImport();
