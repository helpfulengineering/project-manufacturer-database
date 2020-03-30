import log  from "loglevel";
import {createClient, uploadData} from "./uplink/client.js";
import {GRAPHQL_URI, Copy3DPrinterCrowdCovidDoc, FabricationEquipmentDoc} from "./config.js";
import {DOC_API_KEY} from "./config.js";
import {loadDocument} from "./spreadsheetLoader.js";
import exit_codes from "./exit_codes.js";

log.setLevel(log.levels.TRACE);

const client = createClient(GRAPHQL_URI);

const doImport = async (documentConfig, limit) => {
  const entities = await loadDocument({apiKey: DOC_API_KEY, documentConfig, limit});
  await uploadData(client, entities);
};

const main = async (limit1, limit2) => {
  await doImport(Copy3DPrinterCrowdCovidDoc, limit1);
  await doImport(FabricationEquipmentDoc, limit2);
};

// Parse arguments
const expected = 'node index.js <copy3DPrintCrowRowLimit> <fabEquipSheetLimit>';
const numberToImport = process.argv.slice(2);
const cnt = numberToImport.length;
if (cnt === 0 || cnt > 2) {
  console.log(`incorrect number of arguments (${cnt}), expecting: ${expected}`);
  process.exit(exit_codes.ARG_ERROR);
}
const limit1 = parseInt(numberToImport[0], 10);
const limit2 = parseInt(numberToImport[1], 10);

// Run actual program
main(limit1, limit2);
