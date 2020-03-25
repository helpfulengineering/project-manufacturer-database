import log  from "loglevel";
import {createClient, uploadData} from "./uplink/client.js";
import {GRAPHQL_URI, Copy3DPrinterCrowdCovidDoc, FabricationEquipmentDoc} from "./local/config.js";
import {DOC_API_KEY} from "./local/config.js";
import {loadDocument} from "./spreadsheetLoader.js";

log.setLevel(log.levels.TRACE);

const client = createClient(GRAPHQL_URI);

const doImport = async (documentConfig, limit) => {
  const entities = await loadDocument({apiKey: DOC_API_KEY, documentConfig, limit});

  uploadData(client, entities);
};

doImport(Copy3DPrinterCrowdCovidDoc, 1);

doImport(FabricationEquipmentDoc, 1);
