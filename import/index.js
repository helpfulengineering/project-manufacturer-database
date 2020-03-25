import log  from "loglevel";
import {createClient, uploadData} from "./uplink/client.js";
import {GRAPHQL_URI, Copy3DPrinterCrowdsourcingCovid19} from "./local/config.js";
import {DOC_API_KEY} from "./local/config.js";
import {loadSheet} from "./spreadsheetLoader.js";

log.setLevel(log.levels.TRACE);

const client = createClient(GRAPHQL_URI);

const doImport = async ({spreadsheetId, sheetId, rowParser, limit}) => {
  const entities = await loadSheet({apiKey: DOC_API_KEY, spreadsheetId, sheetId, rowParser, limit});

  uploadData(client, entities);
};

doImport({
  spreadsheetId: Copy3DPrinterCrowdsourcingCovid19.spreadsheetId,
  sheetId: Copy3DPrinterCrowdsourcingCovid19.sheetId,
  rowParser: Copy3DPrinterCrowdsourcingCovid19.rowParser,
  limit: 1,
});
