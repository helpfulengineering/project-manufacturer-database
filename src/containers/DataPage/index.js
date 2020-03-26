import PropTypes from 'prop-types';
import React, {useEffect, useState} from "react";
import {Paper, Container} from "@material-ui/core";
import MapIcon from '@material-ui/icons/Map';
import TocIcon from '@material-ui/icons/Toc';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import {useQuery} from "urql";

import DataTable from "../../components/DataTable";
import DataMap from "../../components/DataMap";
import SearchBar from "../../components/SearchBar";
import "./DataPage.scss";
import {API_KEY} from '../../config';
import {debounce} from 'debounce';
import * as queries from "../../data/queries";

/**
 * Convert hierarchical domain based data to flat format usable in table view.
 * @param dbData
 */
const flattenModel = (domainData) => {
  return domainData.Entity.map((entity) => {
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
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const DataPage = () => {
  const [rowsData, setRowsData] = useState([]);
  const [searchCoords, setSearchCoords] = useState({lat: 0, lng: 0});
  const [searchDistance, setSearchDistance] = useState(1000 * 1000 * 1000); // bigger than earth circumference, in kilometers
  const [searchResults, setSearchResults] = useState([]);
  const [tabIdx, setTabIdx] = React.useState(0);


  // TODO: Vary query depending on inputs
  // const [{data: queryResult, fetching, error}] = useQuery({
  //   query: queries.displayQuery,
  //   variables: {
  //     limit: 10
  //   }
  // });
  const [{data: queryResult, fetching, error}] = useQuery({
    query: queries.displaySearchQuery,
    variables: {
      limit: 100,
      distance: searchDistance, // in meters
      point: {
        type: "Point",
        coordinates: [searchCoords.lng, searchCoords.lat]
      }
    }
  });

  useEffect(() => {
    if (queryResult) {
      const flattenedData = flattenModel(queryResult);
      setRowsData(flattenedData);
    }
  }, [queryResult]);

  //TODO: I suggest moving autocomplete logic to SearchBar itself, only passing searchQuery to parent -Ruurd
  const getLocation = debounce(makeRequest, 2000);
  function handleSearch(ev) {
    getLocation(ev.target.value);
  }
  function makeRequest(searchValue) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?component=${searchValue}=${API_KEY}`)
      .then((response) => console.log(response) || setSearchResults(response.results))
  }

  return (
    <Container maxWidth="lg" className="data-page" component={Paper}>
      <div className="data-page__filters">
        <SearchBar
          onSearch={handleSearch}
          searchResults={searchResults}
          coords={searchCoords}
          setCoords={setSearchCoords}
          distance={searchDistance}
          setDistance={setSearchDistance}
        />
      </div>

      <Tabs
        value={tabIdx}
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, value) => setTabIdx(value)}
        aria-label="Search results view tabs"
        centered
      >
        <Tab icon={<TocIcon />} label="Table" />
        <Tab icon={<MapIcon />} label="Map" />
      </Tabs>

      <div className="data-page__content">
        <TabPanel value={tabIdx} index={0}>
          <div className="data-page__table">
            {fetching && <div>Loading...</div>}
            {!fetching && <DataTable rows={rowsData}/>}
            {error && <div>{error}</div>}
          </div>
        </TabPanel>
        <TabPanel value={tabIdx} index={1}>
          <DataMap rows={rowsData}/>
        </TabPanel>
      </div>
    </Container>
  );
};

export default DataPage;
