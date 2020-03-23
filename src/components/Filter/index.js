import React from "react";
import { MenuItem, InputLabel, Select, FormControl } from "@material-ui/core";
import "./Filter.scss";

const Filter = ({ label, activeFilter, handler, listOfValues }) => {
  return (
    <FormControl className="filter">
      <InputLabel>{label}</InputLabel>
      <Select
        labelId="filter"
        value={activeFilter.value}
        onChange={handler}
        label="Equipment"
      >
        {listOfValues.map(item => (
          <MenuItem value={`${label}-${item.value}`} key={item.value}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Filter;
