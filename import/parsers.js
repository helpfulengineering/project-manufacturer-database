export const parseRowType1 = (row) => {
  // For "Copy3DPrinterCrowdsourcingCovid19"
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
