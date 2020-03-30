import React, {useContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';

import MapIcon from '@material-ui/icons/Map';
import TocIcon from '@material-ui/icons/Toc';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "urql";

import DataTable from "../../components/DataTable";
import DataMap from "../../components/DataMap";
import SearchBar from "../../components/SearchBar";
import * as queries from "../../data/queries";
import searchQueryDataDisplayAdapter from './searchQueryDataDisplayAdapter';

import "./DataPage.scss";
import {useAuth0} from "../../auth/react-auth0-spa";
import {RoleContext} from "../App";
import {ROLES} from "../../config";

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
  const { isAuthenticated } = useAuth0();
  const [rowsData, setRowsData] = useState([]);
  const [searchCoords, setSearchCoords] = useState({ lat: 0, lng: 0 });
  const [searchDistance, setSearchDistance] = useState(1000 * 1000 * 1000); // bigger than earth circumference, in kilometers
  const [tabIdx, setTabIdx] = React.useState(0);
  const role = useContext(RoleContext);

  const [{data: queryResult, fetching, error: queryError}] = useQuery({
    query: isAuthenticated && role === ROLES.USER_MANAGER ? queries.displayAuthSearchQuery : queries.displaySearchQuery,
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
    if (queryResult && !queryError) {
      const formattedRowsData = searchQueryDataDisplayAdapter(queryResult);
      setRowsData(formattedRowsData);
    }
  }, [queryResult, queryError]);

  return (
    <div className="data-page">
      <SearchBar
          setCoords={setSearchCoords}
          distance={searchDistance}
          setDistance={setSearchDistance}
        />

      <div>Using location: lat: {searchCoords.lat}, lng: {searchCoords.lng}</div>

      <Tabs
        value={tabIdx}
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, value) => setTabIdx(value)}
        aria-label="Search results view tabs"
        centered
      >
        <Tab label={<><TocIcon fontSize="inherit" /><div className="custom-tab-label">Table</div></>} />
        <Tab label={<><MapIcon fontSize="inherit" /><div className="custom-tab-label">Map</div></>} />
      </Tabs>

      <div className="data-page__content">
        <TabPanel value={tabIdx} index={0}>
          <div className="data-page__table">
            {fetching && <div>Loading...</div>}
            {!fetching && <DataTable rows={rowsData} />}
            {queryError && <div>{JSON.stringify(queryError)}</div>}
          </div>
        </TabPanel>
        <TabPanel value={tabIdx} index={1}>
          <DataMap rows={rowsData} searchCoords={searchCoords} />
        </TabPanel>
      </div>
    </div>
  );
};

export default DataPage;
