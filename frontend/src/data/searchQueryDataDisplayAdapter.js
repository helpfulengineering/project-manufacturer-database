import map from 'lodash/map';
import each from 'lodash/each';
import some from 'lodash/some';

/**
 * Convert hierarchical domain based data to flat format usable in table & map view.
 * @param dbData
 */
export default (sites) => {
  const formattedData = [];
  each(sites, (site) => {
    const entityAndSite = {
      pk: site.pk,
      country: site.country,
      city: site.city,
      hasLocation: Boolean(site.lat && site.lng),
      lat: site.lat,
      lng: site.lng,
      name: site.entity.name,
      experience: site.entity.experience,
      notes: site.entity.notes,
      scale: site.entity.scale,
      entity_pk: site.entity.pk,
      is_valid_email: some(site.entity.contacts, (contact) => contact.is_valid_email),
      email: map(site.entity.contacts, (contact) => contact.email).join(', '),
      slack_handle: map(site.entity.contacts, (contact) => contact.slack_handle).join(', '),
    };
    each(site.equipments, (equipment) => {
      formattedData.push({
        ...entityAndSite,
        brand: equipment.brand,
        model: equipment.model,
        quantity: equipment.quantity,
      });
    });
  });
  return formattedData;
};
