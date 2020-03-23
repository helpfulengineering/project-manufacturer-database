function createData(name, equipment_type, brand, model, city) {
  const equipment = {
    brand,
    model,
    quantity: 1,
  };

  const site = {
    equipments: [equipment],
    city: city
  };

  return {
    name,
    sites: [site],
    entity_type: equipment_type
  };
}

const getData = async () => {
  const rows = [
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Brad", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Jake", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Sun", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Stefanie", "3D printer", "Prusa", "Mk3s", "London"),
    createData("April", "3D printer", "Prusa", "Mk3s", "London")
  ];
  return rows;
};

export default getData;
