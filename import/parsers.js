// Parses spreadsheet to internal data model (closely resembles database model)
import log  from "loglevel";

const SCALE_LIMITS = {
  SMALL: 10, // 0 to 10 units
  MEDIUM: 100, // 11 to 100 units
  // LARGE:
};

export const parseRowCrowdSourceDoc = (row) => {
  // Unused at the moment:
  // 'Do.you.have.a.3D.Printer.': e.g.: "Yes"
  // 'Type', e.g.: "FDM", "SLA,FDM", "unknown", "FDM,SLS,Industrial"
  const name = row['Name'];

  if (!row['Latitude'] || !row['Longitude']) {
    log.info(`skipping row without coordinate, name: ${name}`);
    return undefined;
  }

  const quantityStr = row['Quantity'];
  let quantity;
  try {
    quantity = parseInt(quantityStr, 10);
  } catch (e) {
    log.error(`error parsing quantity: ${quantityStr}, for ${name}, skipping field`);
  }

  const equipment = {
    model: row['What.type.of.3D.printer.do.you.have.'],
    quantity,
  };

  const site = {
    equipments: [equipment],
    city: row['City'],
    country: row['Country'],
    lat: parseFloat(row['Latitude']),
    lng: parseFloat(row['Longitude']),
  };

  const contact = {
    phone: undefined,
    slack: undefined,
    email: row['Email.Address..This.is.public..'], // Note, explicitly stating that it is public
  };
  const entity = {
    name: name,
    sites: [site],
    contacts: [contact],
    experience: `experience: ${row['What.type.of.3D.printing.experience.do.you.have.']}; skills: ${row['Do.you.have.any.design.or.engineering.skills.']}`,
    notes: row['Do.you.have.any.other.comments.'],
    scale: row['ManufacturingCapacity'],
  };

  return entity;
};

export const parseRowFabEquipDoc = (row) => {
  // Unused at the moment:
  // 'What type of technology is this equipment?' e.g.: "FDM", "SLA/DLP", "PLA, ABS, PET, Flexfill (98A)"
  // 'What types of materials can you use?' e.g.: "Aluminum, Foam, Plastics, Brass", "PLA", "objects that can have stickers affixed for scanning"
  // 'How much material do you have in stock?' e.g.: "Several spools, can order more", "4 spools PLA, 1 Spool PETG", "3 kg"
  // Used poorly at the moment: 'What type of equipment do you have access to?' e.g.: "3D Printer", "3D printer, Laser Cutter, CNC Router/Mill, Soldering equipment"

  const slack_handle = row['What is your Slack Handle?'];
  const typeEquipment = row['What type of equipment do you have access to?'];
  if (!slack_handle && !typeEquipment) {
    // empty row
    return undefined;
  }

  if (!row['Latitude'] || !row['Longitude']) {
    log.info(`skipping row without coordinate, slack handle: ${slack_handle}`);
    return undefined;
  }

  const quantityStr = row['What quantity of this equipment do you have access to?'];
  let quantity;
  try {
    quantity = parseInt(quantityStr, 10);
  } catch (e) {
   log.error(`error parsing quantity: ${quantityStr}, for ${slack_handle}, skipping field`);
  }
  let scale;
  if (quantity) {
    if (quantity <= SCALE_LIMITS.SMALL) {
      scale = 'Small';
    } else if (quantity <= SCALE_LIMITS.MEDIUM) {
      scale = 'Medium';
    } else {
      scale = 'Large';
    }
  }

  const equipment = {
    model: typeEquipment,
    quantity: quantityStr,
  };

  const site = {
    equipments: [equipment],
    city: row['Where are you located?'],
    country: row['In which country are you located?'],
    lat: parseFloat(row['Latitude']),
    lng: parseFloat(row['Longitude']),
  };

  const contact = {
    phone: undefined,
    slack: slack_handle,
    email: row['Email or Contact Info'],
  };

  const entity = {
    name: slack_handle,
    sites: [site],
    contacts: [contact],
    experience: `certification: ${row['What certification do you have?']}`, // field value examples: "none", "ISO9001"
    notes: `types: ${row['What type of equipment do you have access to?']}; notes: ${row['Additional notes.  (Optional)']}`,
    scale
  };

  return entity;
};
