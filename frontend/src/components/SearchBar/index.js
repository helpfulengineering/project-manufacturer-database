import PropTypes from 'prop-types';
import React, { useState } from "react";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FormControl, FormGroup } from "@material-ui/core";
import { GoogleApiWrapper } from "google-maps-react";
import IconButton from "@material-ui/core/IconButton";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import AutocompleteField from '../AutocompleteField';
import "./SearchBar.scss";
import Filter from "../Filter";
import {trackEvent} from "../../analytics";
import {SCALE_FILTERS} from "../../data/queries";

const getScaleFilterValues = () => {
  const equipmentList = [
    { value: SCALE_FILTERS.Small, label: "All" },
    { value: SCALE_FILTERS.Medium, label: ">= Medium" },
    { value: SCALE_FILTERS.Large, label: ">= Large" },
  ];
  return equipmentList;
};

function makeReverseGeocodingRequest(lat, lng) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY}`)
    .then(response => response.json());
}

const SearchBar = ({ coords, setCoords, radius, setRadius, scaleFilter, setScaleFilter, textQuery, setTextQuery, children }) => {
  const scaleFilterValues = getScaleFilterValues();
  const [address, setAddress] = useState();
  const [usingLocation, setUseLocation] = useState(false);
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
    setRadius(e.target.value);
  }

  function handleScaleFilterChange(event) {
    setScaleFilter(event.target.value);
  }

  function handleSelectAddress(address) {
    geocodeByAddress(address)
      .then(results => {
        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);
        trackEvent('query-address', { formattedAddress });
        return getLatLng(results[0])
      })
      .then(latLng => {
        const { lat, lng } = latLng;
        setCoords({ lat, lng });
      })
      .catch(error => console.error('Error', error));
  }

  return (
    <form className="search-bar">
      <TextField
        label="Text search"
        helperText="e.g.: 'Injection', 'laser', 'professional'"
        onChange={(e) => setTextQuery(e.target.value)}
        value={textQuery}
        width={"100%"}
        autoFocus={true}
        className="search-bar__text-search"
      />

      <FormGroup className="search-bar__location-search" row>
        <AutocompleteField
          geoLocatedAddress={address}
          handleSelect={handleSelectAddress}
          className="search-bar__location-autocomplete"/>
        {geolocationSupported && (

          <IconButton
            color={usingLocation ? 'secondary' : 'primary'}
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
          value={radius}
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

      <Filter
        label={"scale"}
        activeValue={scaleFilter}
        handler={handleScaleFilterChange}
        listOfValues={scaleFilterValues}
      />

      {children}
    </form>
  );
};

SearchBar.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  setCoords: PropTypes.func.isRequired,
  radius: PropTypes.number,
  setRadius: PropTypes.func.isRequired,
  textQuery: PropTypes.string,
  setTextQuery: PropTypes.func.isRequired,
};

const wrapper = GoogleApiWrapper(
  (props) => ({
    apiKey: process.env.REACT_APP_API_KEY,
  }
  ))(SearchBar);

wrapper.displayName = 'GoogleApiWrapper';

export default wrapper;
