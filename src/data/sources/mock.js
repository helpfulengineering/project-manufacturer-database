function createData(name, equipment, brand, model, city) {
  return { name, equipment, brand, model, city };
}

const requestData = () => {
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
