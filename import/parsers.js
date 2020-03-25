// Parses spreadsheet to internal data model (closely resembles database model)

export const parseRowCrowdSourceDoc = (row) => {
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

  const contact = {
    phone: undefined,
    slack: undefined,
    email: row['Email.Address..This.is.public..'],
  };

  const entity = {
    name: row['Name'],
    sites: [site],
    contacts: [contact],
    experience: row['What.type.of.3D.printing.experience.do.you.have.'],
  };

  return entity;
};

export const parseRowFabEquipDoc = (row) => {
  const equipment = {
    model: row['What type of equipment do you have access to?'],
    quantity: row['What quantity of this equipment do you have access to?'],
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
    slack: row['What is your Slack Handle?'],
    email: row['Email or Contact Info'],
  };

  const entity = {
    name: row['What is your Slack Handle?'],
    sites: [site],
    contacts: [contact],
    experience: '',
    notes: row['Additional notes.  (Optional)']
  };

  return entity;
};
