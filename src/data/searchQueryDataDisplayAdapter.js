/**
 * Convert hierarchical domain based data to flat format usable in table & map view.
 * @param dbData
 */
export default (domainData) => {
  const formattedData = [];
  domainData.SiteInfo.forEach((site) => {
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
      email: site.entity.contacts[0].email, // TODO: safeguard against no contact. TODO: deal with multiple contacts
      slack_handle: site.entity.contacts[0].slack_handle, // TODO: safeguard against no contact. TODO: deal with multiple contacts
    };
    site.equipments.forEach((equipment) => {
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
