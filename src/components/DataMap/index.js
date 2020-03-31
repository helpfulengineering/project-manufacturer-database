import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {Map, TileLayer, CircleMarker} from 'react-leaflet';
import Button from '@material-ui/core/Button';
import Control from 'react-leaflet-control';

import Modal from '../Modal';
import DataTable from '../DataTable';
import './DataMap.scss';
import {ADDITIONAL_AUTHORIZATION_LABEL } from "../../labels";
import {MAX_QUERY_SIZE} from "../../config";
import {LimitReachedAlert} from "../Alerts";


const MAP_CENTER = [30.0, 10.0];
const MAP_ZOOM = 2;

function DataMap({rows, searchCoords}) {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  useEffect(() => {
    setMarkers(rows.filter(i => i.hasLocation));
  }, [rows]);

  const isLimited = rows.length === MAX_QUERY_SIZE;

  return (
    <>
      {isLimited && <LimitReachedAlert /> }
      <div className="map__container">
        <Map center={MAP_CENTER} zoom={MAP_ZOOM}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {searchCoords &&
            <CircleMarker center={[searchCoords.lat, searchCoords.lng]}
                          radius={4}
                          color={'#ff0000'}
            />
          }
          {markers.map(row =>
            <CircleMarker center={[row.lat, row.lng]}
              radius={6}
              key={row.pk}
              onClick={() => {
                setSelectedMarker(row);
                setIsDetailModalOpen(true)
              }}
            />
          )}

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
  })
};
DataMap.defaultProps = {
  rows: [],
};

export default DataMap;
