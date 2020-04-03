import PropTypes from 'prop-types';
import React, { useState } from "react";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {FormControl, FormGroup} from "@material-ui/core";
import { GoogleApiWrapper } from "google-maps-react";
import IconButton from "@material-ui/core/IconButton";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AutocompleteField from '../AutocompleteField';
import { API_KEY } from '../../config';
import "./SearchBar.scss";
import TextField from "@material-ui/core/TextField";

// const getEquipmentFilterValues = () => {
//   const equipmentList = [
//     { value: "3d-printer", label: "3D printer" },
//     { value: "cnc", label: "CNC" }
//   ];
//   return equipmentList;
// };

function makeReverseGeocodingRequest(lat, lng) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    .then(response => response.json());
}

const SearchBar = ({ coords, setCoords, distance, setDistance }) => {
  // const equipmentFilterValues = getEquipmentFilterValues();
  // const [type, setEquipmentType] = useState(equipmentFilterValues[0]); // Currently disabled because we can't filter on this yet in the database.
  const [address, setAddress] = useState();
  const [usingLocation, setUseLocation]  = useState(false)
  const geolocationSupported = navigator && navigator.geolocation;

  function useDeviceLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCoords({
        lat: latitude,
        lng: longitude,
      });
      setUseLocation(true);
      makeReverseGeocodingRequest(latitude, longitude)
        .then(data => {
          if (data.results.length >= 0 && data.results[0]) {
            setAddress(data.results[0].formatted_address)
          } else {
            console.error('reverse geocoding request failed, no good results for coordinate');
          }
        });
    }, (error) => {
      console.error('could not get device location: ', error.message)
    });
  }

  function searchDistanceChange(e) {
    setDistance(e.target.value);
  }

  // function handleEquipmentFilterChange(ev) {
  //   const item = equipmentFilterValues.find(
  //     item => item.value === ev.target.value
  //   );
  //   setEquipmentType(item);
  // }

  function handleSelectAddress(address) {
    geocodeByAddress(address)
      .then(results => {
        setAddress(results[0].formatted_address)
        return getLatLng(results[0])
      }
      )
      .then(latLng => {
        const { lat, lng } = latLng;
        setCoords({ lat, lng });
      })
      .catch(error => console.error('Error', error));
  }

  return (
    <form className="search-bar">
      <FormGroup row>
        <AutocompleteField geoLocatedAddress={address} handleSelect={handleSelectAddress} />
        {geolocationSupported && (

          <IconButton
            color={usingLocation ? 'secondary' : 'primary' }
            aria-label="use device location"
            title="use device location"
            onClick={useDeviceLocation}
            className="search-bar__gps-icon"
          >
            <GpsFixedIcon />
          </IconButton>
        )}
      </FormGroup>

      <FormControl>
        <InputLabel id="range-input-label">Range</InputLabel>
        <Select
          labelId="range-input-label"
          id="range-input"
          value={distance}
          onChange={searchDistanceChange}
        >
          <MenuItem value={10 * 1000}>10 km</MenuItem>
          <MenuItem value={10 * 1000}>25 km</MenuItem>
          <MenuItem value={50 * 1000}>50 km</MenuItem>
          <MenuItem value={100 * 1000}>100 km</MenuItem>
          <MenuItem value={250 * 1000}>250 km</MenuItem>
          <MenuItem value={500 * 1000}>500 km</MenuItem>
          <MenuItem value={1000 * 1000}>1,000 km</MenuItem>
          <MenuItem value={5 * 1000 * 1000}>5,000 km</MenuItem>
          <MenuItem value={1000 * 1000 * 1000}>Unlimited</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Lat" value={coords.lat} disabled />
      <TextField label="lng" value={coords.lng} disabled />

      {/*<Filter*/}
      {/*  label={"equipment"}*/}
      {/*  activeFilter={type}*/}
      {/*  handler={handleEquipmentFilterChange}*/}
      {/*  listOfValues={equipmentFilterValues}*/}
      {/*  disabled*/}
      {/*/>*/}
    </form>
  );
};

SearchBar.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  // setCoords,
  // distance,
  // setDistance
};

const wrapper = GoogleApiWrapper(
  (props) => ({
      apiKey: API_KEY,
    }
  ))(SearchBar);

wrapper.displayName = 'GoogleApiWrapper';

export default wrapper;
