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
        notes
        contacts {
          slack_handle
        }
      }
      equipments {
        brand
        model
        quantity
      }
    }
  }
`;

// NOTE: these queries are a bit copy paste, maybe we can use GraphQL fragments or something.
export const displayAuthSearchQuery = `
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
        notes
        contacts {
          email
          slack_handle
        }
      }
      equipments {
        brand
        model
        quantity
      }
    }
  }
`;
