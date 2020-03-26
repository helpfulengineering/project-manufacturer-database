
// Currently unused query
export const displayQuery = `
  query ($limit: Int!) {
    Entity(limit: $limit) {
      name
      sites {
        equipments {
          brand
          model
          quantity
        }
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
      name
      sites {
        equipments {
          brand
          model
          quantity
        }
        city
        lat
        lng
      }
      experience
    }
  }
`;
