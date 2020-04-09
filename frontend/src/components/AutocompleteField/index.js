import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import { Input, InputAdornment } from '@material-ui/core';
import {PROJECT_SLACK_CHANNEL} from "../../config";
import './AutoCompleteField.scss'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const errorLabels = {
  OVER_QUERY_LIMIT: `Rate limit exceeded, if this persists, please contact ${PROJECT_SLACK_CHANNEL} slack channel`
};
const formatError = (errorKey) => {
  const label = errorLabels[errorKey];
  if(label) {
    return label;
  }
  return errorKey;
};

const AutocompleteField = ({ geoLocatedAddress, handleSelect }) => {
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (geoLocatedAddress) {
      setAddress(geoLocatedAddress)
    }
  }, [geoLocatedAddress]);

  function handleChange(address) {
    setAddress(address)
  }

  function onError(status) {
    if (!errors.includes(status)) {
      setErrors([...errors, status]);
    }
  }

  const debounceMs = 1000;
  return (
    <div className='field-container'>
      <LightTooltip open={errors.length > 0} title={<div>{errors.map(message => <div key={message}>{formatError(message)}</div>)}</div>}>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
          onError={onError}
          debounce={debounceMs}
          highlightFirstSuggestion
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />

              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item suggestion-item--active' : 'suggestion-item suggestion-item';
                  return (
                    <div {...getSuggestionItemProps(suggestion, {className})} key={suggestion.description}>
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </LightTooltip>
    </div>
  );
};

AutocompleteField.propTypes = {
  // geoLocatedAddress
  handleSelect: PropTypes.func.isRequired
};

export default AutocompleteField
