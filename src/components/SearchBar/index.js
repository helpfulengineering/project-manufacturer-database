import React, {useState} from "react";
import {
  Input,
  InputAdornment,
  FormControl,
  TextField
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"
import "./SearchBar.scss";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Filter from "../Filter";

const getEquipmentFilterValues = () => {
  const equipmentList = [
    {value: "3d-printer", label: "3D printer"},
    {value: "cnc", label: "CNC"}
  ];
  return equipmentList;
};

const SearchBar = ({ onSearch, searchResults, coords, setCoords, distance, setDistance}) => {
  const equipmentFilterValues = getEquipmentFilterValues();
  const [type, setEquipmentType] = useState(equipmentFilterValues[0]);
  const geolocationSupported = navigator && navigator.geolocation;

  function useDeviceLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('position: ', position.coords);
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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
    console.log('equipment filter change: ', item);
    setEquipmentType(item);
  }

  return (
    <>
      <FormControl className="search-bar">
        {/* <Input
          label="Search"
          onChange={onSearch}
          className="search-bar__input"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        /> */}
        <Autocomplete
          options={searchResults}
          getOptionLabel={option => option}
          style={{ width: 300 }}
          renderInput={params => <TextField {...params} label="Search" />}
        />
      </FormControl>

      {geolocationSupported && (
        <IconButton color="secondary" aria-label="use device location" onClick={useDeviceLocation}>
          <GpsFixedIcon/>
        </IconButton>
      )}

      <FormControl>
        <InputLabel id="range-input-label">Range</InputLabel>
        <Select
          labelId="range-input-label"
          id="range-input"
          value={distance}
          onChange={searchDistanceChange}
        >
          <MenuItem value={10*1000}>5 km</MenuItem>
          <MenuItem value={10*1000}>10 km</MenuItem>
          <MenuItem value={50*1000}>50 km</MenuItem>
          <MenuItem value={100*1000}>100 km</MenuItem>
          <MenuItem value={250*1000}>250 km</MenuItem>
          <MenuItem value={1000*1000}>1,000 km</MenuItem>
          <MenuItem value={5*1000*1000}>5,000 km</MenuItem>
          <MenuItem value={1000*1000*1000}>Unlimited</MenuItem>
        </Select>
      </FormControl>

      <Filter
        label={"equipment"}
        activeFilter={type}
        handler={handleEquipmentFilterChange}
        listOfValues={equipmentFilterValues}
      />
    </>
  );
};

export default SearchBar;
