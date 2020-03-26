
// Currently unused query
export const displayQuery = `
  query ($limit: Int!) {
    Entity(limit: $limit) {
      pk
      name
      notes
      sites {
        equipments {
          brand
          model
          quantity
        }
        country
        city
        lat
        lng
      }
      experience
    }
  }
`;

export const displaySearchQuery = `
  query ($limit: Int!, $distance: Float!, $point: geography!) {
    Entity(
      limit: $limit,
      where: {sites: {location: { _st_d_within: { distance: $distance, from: $point}}}}
    ) {
      pk
      name
      notes
      sites {
        equipments {
          brand
          model
          quantity
        }
        country
        city
        lat
        lng
      }
      experience
    }
  }
`;
