import React from "react";
import {
  Input,
  InputAdornment,
  FormControl,
  InputLabel
} from "@material-ui/core";
import "./SearchBar.scss";
import SearchIcon from "@material-ui/icons/Search";

const SearchBar = ({ onSearch }) => {
  return (
    <FormControl className="search-bar">
      <Input
        label="Search"
        onChange={onSearch}
        className="search-bar__input"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchBar;
