import React, {useContext, useEffect, useState} from 'react';

import MapIcon from '@material-ui/icons/Map';
import TocIcon from '@material-ui/icons/Toc';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useQuery } from 'urql';

import DataTable from '../../components/DataTable';
import DataMap from '../../components/DataMap';
import SearchBar from '../../components/SearchBar';
import ExportControl from '../../components/ExportControl';
import * as queries from '../../data/queries';

import './DataPage.scss';
import {useAuth0} from '../../auth/react-auth0-spa';
import {RoleContext} from '../App';
import {
  ROLES,
  MAX_QUERY_SIZE
} from '../../config';
import searchQueryDataDisplayAdapter from '../../data/searchQueryDataDisplayAdapter';
import TabPanel from './TabPanel';

const DataPage = () => {
  const { isAuthenticated } = useAuth0();
  const [rowsData, setRowsData] = useState([]);
  const [searchCoords, setSearchCoords] = useState({ lat: 0, lng: 0 });
  const [searchDistance, setSearchDistance] = useState(1000 * 1000 * 1000); // bigger than earth circumference, in kilometers
  const [scaleFilter, setScaleFilter] = useState();
  const [tabIdx, setTabIdx] = React.useState(0);
  const role = useContext(RoleContext);

  const [{data: queryResult, fetching, error: queryError}] = useQuery({
    query: queries.displaySearchQuery(isAuthenticated && role === ROLES.USER_MANAGER),
    variables: {
      limit: MAX_QUERY_SIZE,
      distance: searchDistance, // in meters
      point: {
        type: 'Point',
        coordinates: [searchCoords.lng, searchCoords.lat]
      },
      scale: (scaleFilter && scaleFilter.value.split(',')) || ['Small', 'Medium', 'Large']
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
      <Box width="80ch">
        <Typography paragraph={true}>
          Search through pandemic volunteers who have offered their service for 3D printing, laser cutting and more.
        </Typography>
        <Typography paragraph={true}>
          If you end up using this please let us know in the <em>#project-manufacturer-database</em> slack channel (<a href="https://www.helpfulengineering.org/slack">slack workspace</a>).
        </Typography>
      </Box>

      <SearchBar
        coords={searchCoords}
        setCoords={setSearchCoords}
        distance={searchDistance}
        setDistance={setSearchDistance}
        scaleFilter={scaleFilter}
        setScaleFilter={setScaleFilter}
      />
      <ExportControl data={rowsData} />

      <Tabs
        value={tabIdx}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, value) => setTabIdx(value)}
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
