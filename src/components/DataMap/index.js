import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

import DataTable from '../DataTable';
import './DataMap.scss';

class DataMap extends Component {
  state = {
    lat: 30.0,
    lng: 10.0,
    zoom: 2,
  };

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div className="map__container">
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { this.props.rows && this.props.rows.filter(i => i.hasLocation).map(row =>
              <Marker position={[row.lat, row.lng]} key={row.name}/>
          )}
        </Map>
      </div>
    )
  }
}

DataMap.propTypes = DataTable.propTypes; // NOTE, same as input as table at the moment

export default DataMap;
