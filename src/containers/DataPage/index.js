import React, { useState } from "react";
import DataTable from "../../components/DataTable";
import SearchBar from "../../components/SearchBar";
import { Paper, Container } from "@material-ui/core";
import "./DataPage.scss";
import Filter from "../../components/Filter";

const getEquipmentFilterValues = () => {
  const equipmentList = [
    { value: "3d-printer", label: "3D printer" },
    { value: "cnc", label: "CNC" }
  ];
  return equipmentList;
};

function createData(name, equipment, brand, model, city) {
  return { name, equipment, brand, model, city };
}

const requestData = () => {
  const rows = [
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London"),
    createData("Tom", "3D printer", "Prusa", "Mk3s", "London")
  ];
  return rows;
};

const DataPage = () => {
  const equipmentFilterValues = getEquipmentFilterValues();
  const rowsData = requestData();
  const [type, setEquipmentType] = useState(equipmentFilterValues[0]);

  function handleSearch(ev) {
    console.log(ev.target.value);
  }

  function handleEquipmentFilterChange(ev) {
    const item = equipmentFilterValues.find(
      item => item.value === ev.target.value
    );
    console.log(item);
    setEquipmentType(item);
  }

  console.log(type);

  return (
    <Container maxWidth="lg" className="data-page" component={Paper}>
      <div className="data-page__filters">
        <SearchBar onSearch={handleSearch} />
        <Filter
          label={"equipment"}
          activeFilter={type}
          handler={handleEquipmentFilterChange}
          listOfValues={equipmentFilterValues}
        />
        <Filter
          label={"equipment"}
          activeFilter={type}
          handler={handleEquipmentFilterChange}
          listOfValues={equipmentFilterValues}
        />
        <Filter
          label={"equipment"}
          activeFilter={type}
          handler={handleEquipmentFilterChange}
          listOfValues={equipmentFilterValues}
        />
      </div>
      <div className="data-page__table">
        <DataTable rows={rowsData} />
      </div>
    </Container>
  );
};

export default DataPage;
