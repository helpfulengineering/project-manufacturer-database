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
import {trackEvent} from "../../analytics";
import {SCALE_FILTERS} from "../../data/queries";

const DataPage = () => {
  const { isAuthenticated } = useAuth0();
  const [rowsData, setRowsData] = useState([]);
  const [searchCoords, setSearchCoords] = useState({ lat: 0, lng: 0 });
  const [searchRadius, setSearchRadius] = useState(1000 * 1000 * 1000); // bigger than earth circumference, in kilometers
  const [textQuery, setTextQuery] = useState('');
  const [scaleFilter, setScaleFilter] = useState(SCALE_FILTERS.Small);
  const [tabIdx, setTabIdx] = React.useState(0);
  const role = useContext(RoleContext);

  const [{data: queryResult, fetching, error: queryError}] = useQuery({
    query: queries.displaySearchQuery(textQuery, isAuthenticated && role === ROLES.USER_MANAGER),
    variables: {
      limit: MAX_QUERY_SIZE,
      radius: searchRadius, // in meters
      point: {
        type: 'Point',
        coordinates: [searchCoords.lng, searchCoords.lat]
      },
      scale: scaleFilter.split(','),
      textQuery,
    }
  });

  useEffect(() => {
    if (queryResult && !queryError) {
      const sites = queryResult.search_sites || queryResult.SiteInfo;
      const formattedRowsData = searchQueryDataDisplayAdapter(sites);
      setRowsData(formattedRowsData);

      if (searchCoords.lng !== 0 || searchCoords.lat !== 0) {
        // Result for location search different from start position (0, 0)
        trackEvent('query-results', {
          rows: formattedRowsData.length,
          query: {
            scale: scaleFilter,
            distance: searchRadius,
            coordinates: [searchCoords.lng, searchCoords.lat],
          }
        });
      }
    }
  }, [queryResult, queryError]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="data-page">
      <div className="intro">
        <Typography variant="h5" component="h2">
          Manufacturing volunteer search
        </Typography>

        <div className='funding-note'>
          <h1>Call for maintainers </h1>
          <p>
            The site is running mostly on its own nowadays.
            Though we get the occasional request and could use maintainers.
          </p>

          <p>
            If you would like to help, please reach out to use on Slack.
            You can find us on the <em>#project-manufacturer-database</em> slack channel (<a href="https://www.helpfulengineering.org/slack">slack workspace</a>)
          </p>
        </div>

        <Box width="80ch" maxWidth="100%">
          <Typography paragraph={true}>
            Search through pandemic volunteers who have offered their service for 3D printing, laser cutting and more. In order to access volunteers' contacts and to be able to contact them, you must log in first.
          </Typography>
          <Typography paragraph={true}>
            If you want to volunteer you fabrication equipment please fill in <a href="https://docs.google.com/forms/d/e/1FAIpQLSfCzXLp4cvlgBFh1OR81-Kek6SAGnNC8jJQcHyBUJbPSIvXgA/viewform">this form</a>.
          </Typography>
          <Typography paragraph={true}>
            If you end up using this please let us know in the <em>#project-manufacturer-database</em> slack channel (<a href="https://www.helpfulengineering.org/slack">slack workspace</a>).
          </Typography>
        </Box>
      </div>

      <SearchBar
        coords={searchCoords}
        setCoords={setSearchCoords}
        radius={searchRadius}
        setRadius={setSearchRadius}
        scaleFilter={scaleFilter}
        setScaleFilter={setScaleFilter}
        textQuery={textQuery}
        setTextQuery={setTextQuery}
      >
        <ExportControl rows={rowsData} className="export-button" />
      </SearchBar>

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
          <DataMap rows={rowsData} searchCoords={searchCoords} setCoords={setSearchCoords} searchRadius={searchRadius} />
        </TabPanel>
      </div>
    </div>
  );
};

export default DataPage;
