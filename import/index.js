const log = require('loglevel');
const {FabricationEquipmentDoc} = require("./config");
const {Copy3DPrinterCrowdCovidDoc} = require("./config");
const {createClient} = require("./uplink/client");
const {getUploadToken} = require("./auth/uploadAuth");
const {loadDocument} = require("./spreadsheetLoader");
const exit_codes = require('./exit_codes');
const {uploadData} = require("./uplink/client");
const {GOOGLE_AUTH} = require("./config");
const {GRAPHQL_URI} = require("./config");

log.setLevel(log.levels.TRACE);

const doImport = async (uploadClient, documentConfig, limit) => {
  const entities = await loadDocument(GOOGLE_AUTH, documentConfig, limit);
  await uploadData(uploadClient, entities);
};

const main = async (limit1, limit2) => {
  const uploadToken = await getUploadToken();
  const uploadClient = createClient(GRAPHQL_URI, uploadToken);

  await doImport(uploadClient, Copy3DPrinterCrowdCovidDoc, limit1);
  await doImport(uploadClient, FabricationEquipmentDoc, limit2);
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
