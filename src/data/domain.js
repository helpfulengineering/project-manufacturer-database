// Domain model closely resembling backend data model.

import PropTypes from 'prop-types';

const EquipmentTypePT = {
  type: PropTypes.string,
  category: PropTypes.string,
};

export const EquipmentPT = {
  equipment_type: PropTypes.arrayOf(PropTypes.shape(EquipmentTypePT)),
  brand: PropTypes.string,
  model: PropTypes.string,
  misc_details: PropTypes.string,
  quantity: PropTypes.number.isRequired,
};

export const SitePT = {
  equipments: PropTypes.arrayOf(PropTypes.shape(EquipmentPT)),
  country: PropTypes.string,
  city: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
};
export const EntityPT = {
  name: PropTypes.string.isRequired,
  entity_type: PropTypes.string,
  sites: PropTypes.arrayOf(PropTypes.shape(SitePT)),
};
