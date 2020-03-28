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
      notes: site.entity.notes,
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