import React, { useState, useEffect } from 'react';
import {Map, TileLayer, CircleMarker} from 'react-leaflet';
import Button from '@material-ui/core/Button';

import Modal from '../Modal';
import DataTable from '../DataTable';
import './DataMap.scss';

const MAP_CENTER = [30.0, 10.0];
const MAP_ZOOM = 2;
function DataMap({rows}) {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  useEffect(() => {
    setMarkers(rows.filter(i => i.hasLocation));
  }, [rows]);
  return (
    <>
      <div className="map__container">
        <Map center={MAP_CENTER} zoom={MAP_ZOOM}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map(row =>
            <CircleMarker center={[row.lat, row.lng]}
              radius={2}
              key={row.pk}
              onClick={() => {
                setSelectedMarker(row);
                setIsDetailModalOpen(true)
              }}
            />
          )}
        </Map>
      </div>
      <Modal open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}>
          <div className="map-modal-contents">
            <div><strong>Name</strong>: {selectedMarker.name}</div>
            <div><strong>Equipment</strong>: {selectedMarker.equipment}</div>
            <div><strong>Brand</strong>: {selectedMarker.brand}</div>
            <div><strong>Model</strong>: {selectedMarker.model}</div>
            <div><strong>Quantity</strong>: {selectedMarker.quantity}</div>
            <div><strong>Country</strong>: {selectedMarker.country}</div>
            <div><strong>City</strong>: {selectedMarker.city}</div>
            <div><strong>Notes</strong>: {selectedMarker.notes}</div>
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

DataMap.propTypes = DataTable.propTypes; // NOTE, same as input as table at the moment
DataMap.defaultProps = {
  rows: [],
};

export default DataMap;
