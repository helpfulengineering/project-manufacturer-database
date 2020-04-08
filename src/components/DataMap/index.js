import PropTypes from 'prop-types';
import L from 'leaflet';
import React, {useState, useEffect } from 'react';
import {Map, TileLayer, CircleMarker } from 'react-leaflet';
import GreatCircle from 'react-leaflet-greatcircle'; // distorts correctly near poles
import Button from '@material-ui/core/Button';
import Control from 'react-leaflet-control';

import Modal from '../Modal';
import DataTable from '../DataTable';
import './DataMap.scss';
import {ADDITIONAL_AUTHORIZATION_LABEL } from "../../labels";
import {MAX_QUERY_SIZE} from "../../config";
import {LimitReachedAlert} from "../Alerts";

// Set bounds to world https://stackoverflow.com/a/58309265
// map can go beyond world bound to allow centering view on places near edge when zoomed out.
const southWest = L.latLng(-90, -300);
const northEast = L.latLng(90, 300);
const MAP_BOUNDS = L.latLngBounds(southWest, northEast);
const MAP_CENTER = [30.0, 10.0];
const MAP_ZOOM = 2;

const MARKER_SCALE_COLOR_MAP = {
  small: '#3388ff',
  medium: '#1b4cff',
  large: '#7e18ff',
};

const SCALE_IDX_MAP = {
  small: 0,
  medium: 1,
  large: 2,
};

const scaleCompare = ({scale: scaleA='small'}, {scale: scaleB='small'}) => {
  // Return greater than 0 if a is greater than b
  // Return 0 if a equals b
  // Return less than 0 if a is less than b
  return SCALE_IDX_MAP[scaleA.toLowerCase()] - SCALE_IDX_MAP[scaleB.toLowerCase()];
};

const getStyling = ({scale}) => {
  if (scale) {
    const idx = SCALE_IDX_MAP[scale.toLowerCase()];
    return {
      color: MARKER_SCALE_COLOR_MAP[scale.toLowerCase()],
      fillOpacity: 0.2 + idx * 0.3,
    };
  } else {
    return {
      color: MARKER_SCALE_COLOR_MAP.small
    };
  }
};

function DataMap({rows, searchCoords, setCoords, searchRadius}) {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    // sort rows so most important one are at the back (and are drawn on top).
    const reSortedRows = rows.slice().sort(scaleCompare);
    setMarkers(reSortedRows.filter(i => i.hasLocation));
  }, [rows]);

  const isLimited = rows.length === MAX_QUERY_SIZE;

  const handleClick = (event) => {
    setCoords(event.latlng);
  };

  return (
    <>
      {isLimited && <LimitReachedAlert /> }
      <div className="map__container">
        <Map
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          maxBounds={MAP_BOUNDS}
          onClick={handleClick}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map(row =>
            <CircleMarker
              center={[row.lat, row.lng]}
              radius={6}
              key={row.pk}
              onClick={(event) => {
                setSelectedMarker(row);
                setIsDetailModalOpen(true);
              }}
              bubblingMouseEvents={false}
              {...getStyling(row)}
            />
          )}
          {searchCoords &&
          <CircleMarker
            center={[searchCoords.lat, searchCoords.lng]}
            radius={4}
            fillColor={'#ff0000'}
            fillOpacity={1.0}
            stroke={false}
          />
          }
          {searchRadius && searchRadius < 100 * 1000 * 1000 &&
            <GreatCircle
              center={[searchCoords.lat, searchCoords.lng]}
              radius={searchRadius}
              color={'#ff0000'}
              fill={false}
              weight={2}
              dashArray={'4'}
            />
          }

          <Control position="bottomleft" className="custom-control">
            <div>{rows.length} {rows.length === 1 ? 'result' : 'results'}</div>
          </Control>
        </Map>
      </div>
      <Modal open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}>
          <div className="map-modal-contents">
            <div><strong>Name</strong>: {selectedMarker.name}</div>
            {/*<div><strong>Equipment</strong>: {selectedMarker.equipment}</div>*/}
            {/*<div><strong>Brand</strong>: {selectedMarker.brand}</div>*/}
            <div><strong>Model</strong>: {selectedMarker.model}</div>
            <div><strong>Quantity</strong>: {selectedMarker.quantity}</div>
            <div><strong>City</strong>: {selectedMarker.city}</div>
            <div><strong>Country</strong>: {selectedMarker.country}</div>
            <div><strong>Experience</strong>: {selectedMarker.experience}</div>
            <div><strong>Notes</strong>: {selectedMarker.notes}</div>
            <div><strong>Scale</strong>: {selectedMarker.scale}</div>
            <div title={ADDITIONAL_AUTHORIZATION_LABEL}><strong>Slack*</strong>: {selectedMarker.slack_handle}</div>
            <div title={ADDITIONAL_AUTHORIZATION_LABEL}><strong>Email*</strong>: {selectedMarker.email}</div>
          </div>
          <Button variant="contained"
            color="primary"
            size="small"
            onClick={() => setIsDetailModalOpen(false)}>
            OK
          </Button>
      </Modal>
    </>
  );
}

DataMap.propTypes = {
  ...DataTable.propTypes, // NOTE, extension of inputs used by table
  searchCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  setCoords: PropTypes.func.isRequired,
  searchRadius: PropTypes.number
};
DataMap.defaultProps = {
  rows: [],
};

export default DataMap;
