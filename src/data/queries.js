const contacts = `
  contacts {
    email
    slack_handle
  }
`;

export const displaySearchQuery = (isManager) => `
  query ($limit: Int!, $distance: Float!, $point: geography!) {
    SiteInfo(
      limit: $limit,
      where: {location: { _st_d_within: { distance: $distance, from: $point}}}
    ) {
      pk
      city
      country
      lat
      lng
      entity {
        name
        experience
        notes
        ${isManager ? contacts : ''}
      }
      equipments {
        brand
        model
        quantity
      }
    }
  }
`;