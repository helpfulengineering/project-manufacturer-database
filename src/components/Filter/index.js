import React from "react";
import PropTypes from "prop-types";
import { MenuItem, InputLabel, Select, FormControl } from "@material-ui/core";
import "./Filter.scss";

const Filter = ({ label, activeValue, handler, listOfValues, ...rest }) => {
  return (
    <FormControl className="filter">
      <InputLabel>{label}</InputLabel>
      <Select
        labelId="filter"
        value={activeValue}
        onChange={handler}
        label="Equipment"
        {...rest}
      >
        {listOfValues.map(item => (
          <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

Filter.propTypes = {
  label: PropTypes.string,
  activeValue: PropTypes.string,
  handler: PropTypes.func,
  listOfValues: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  }))
};

export default Filter;
