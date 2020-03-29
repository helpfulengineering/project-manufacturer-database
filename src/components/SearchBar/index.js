import React, { useState } from "react";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FormControl } from "@material-ui/core";
import { GoogleApiWrapper } from "google-maps-react";
import IconButton from "@material-ui/core/IconButton";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Filter from "../Filter";
import AutocompleteField from '../AutocompleteField';
import { API_KEY } from '../../config';
import "./SearchBar.scss";

const getEquipmentFilterValues = () => {
  const equipmentList = [
    { value: "3d-printer", label: "3D printer" },
    { value: "cnc", label: "CNC" }
  ];
  return equipmentList;
};

const SearchBar = ({ setCoords, distance, setDistance }) => {
  const equipmentFilterValues = getEquipmentFilterValues();
  const [type, setEquipmentType] = useState(equipmentFilterValues[0]);
  const [address, setAddress] = useState();
  const geolocationSupported = navigator && navigator.geolocation;

  function makeReverseGeocodingRequest(lat, lng) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
      .then(response => response.json());
  }

  function useDeviceLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCoords({
        lat: latitude,
        lng: longitude,
      });
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

  function handleEquipmentFilterChange(ev) {
    const item = equipmentFilterValues.find(
      item => item.value === ev.target.value
    );
    setEquipmentType(item);
  }

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
  };

  return (
    <div className="search-bar__filters">
      <div className="search-bar__input">
        <AutocompleteField geoLocatedAddress={address} handleSelect={handleSelectAddress} />
        {geolocationSupported && (
          <IconButton
            color="secondary" aria-label="use device location"
            onClick={useDeviceLocation}
            className="search-bar__gps-icon"
          >
            <GpsFixedIcon />
          </IconButton>
        )}
      </div>

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
          <MenuItem value={1000 * 1000}>1,000 km</MenuItem>
          <MenuItem value={5 * 1000 * 1000}>5,000 km</MenuItem>
          <MenuItem value={1000 * 1000 * 1000}>Unlimited</MenuItem>
        </Select>
      </FormControl>

      <Filter
        label={"equipment"}
        activeFilter={type}
        handler={handleEquipmentFilterChange}
        listOfValues={equipmentFilterValues}
        disabled
      />
    </div>
  );
};

const wrapper = GoogleApiWrapper(
  (props) => ({
      apiKey: API_KEY,
    }
  ))(SearchBar);

wrapper.displayName = 'GoogleApiWrapper';

export default wrapper;
