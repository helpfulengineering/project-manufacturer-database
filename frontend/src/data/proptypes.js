import PropTypes from "prop-types";

export const ROWS = PropTypes.arrayOf(PropTypes.shape({
  pk: PropTypes.number.isRequired,
  country: PropTypes.string,
  city: PropTypes.string,
  hasLocation: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  name: PropTypes.string,
  notes: PropTypes.string,
  brand: PropTypes.string,
  model: PropTypes.string,
  quantity: PropTypes.number,
}));
