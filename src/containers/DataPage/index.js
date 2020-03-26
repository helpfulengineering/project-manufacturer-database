import React, {useEffect, useState} from "react";
import { Paper, Container } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useQuery } from "urql";

import DataTable from "../../components/DataTable";
import DataMap from "../../components/DataMap";
import Filter from "../../components/Filter";
import SearchBar from "../../components/SearchBar";
// import getData from "../../data/data"; //mock data source
import "./DataPage.scss";

const VIEW_TABLE = 'TABLE';
const VIEW_MAP = 'MAP';

// limit 10 until we get pagination working
const displayQuery = `
  query {
    Entity(limit: 10) {
      name
      sites {
        equipments {
          brand
          model
          quantity
        }
        city
        lat
        lng
      }
      experience
    }
  }
`;

const getEquipmentFilterValues = () => {
  const equipmentList = [
    { value: "3d-printer", label: "3D printer" },
    { value: "cnc", label: "CNC" }
  ];
  return equipmentList;
};

/**
 * Convert hierarchical domain based data to flat format usable in table view.
 * @param dbData
 */
const flattenModel = (result) => {
  if (result) {
    return result.Entity.map((entity) => {
      const firstSite = entity.sites[0];
      const firstEquipment = firstSite.equipments[0];
      return {
        name: entity.name,
        brand: firstEquipment.brand,
        model: firstEquipment.model,
        city: firstSite.city,
        hasLocation: firstSite.lat && firstSite.lng,
        lat: firstSite.lat,
        lng: firstSite.lng,
      };
    });
  }
  return [];
};

const DataPage = () => {
  const equipmentFilterValues = getEquipmentFilterValues();
  const [rowsData, setRowsData] = useState([]);
  const [view, setView] = useState(VIEW_TABLE);
  const [type, setEquipmentType] = useState(equipmentFilterValues[0]);
  const [{ data, fetching, error }] = useQuery({
    query: displayQuery,
  });

  useEffect(() => {
    const flattenedData = flattenModel(data);
    setRowsData(flattenedData);
  }, [data]);

  function handleSearch(ev) {
    console.log('search: ', ev.target.value);
  }

  function handleEquipmentFilterChange(ev) {
    const item = equipmentFilterValues.find(
      item => item.value === ev.target.value
    );
    console.log('equipment filter change: ', item);
    setEquipmentType(item);
  }

  function switchView() {
    setView(view === VIEW_TABLE ? VIEW_MAP : VIEW_TABLE);
  }

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
      <Button onClick={switchView} variant="contained" color="secondary">{view === VIEW_TABLE ? 'Show map' : 'Show table'}</Button>

      <div className="data-page__content">
        { view === VIEW_TABLE &&
          <div className="data-page__table">
            {fetching && <div>Loading...</div>}
            {!fetching && <DataTable rows={rowsData} />}
            {error && <div>{error}</div>}
          </div>
        }
        { view === VIEW_MAP &&
          <DataMap rows={rowsData} />
        }
      </div>
    </Container>
  );
};

export default DataPage;
