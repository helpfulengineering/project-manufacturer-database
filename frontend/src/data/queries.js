export const SCALE_FILTERS = {
  Small: "Small,Medium,Large",
  Medium: "Medium,Large",
  Large: "Large",
};

const contacts = `
  contacts {
    email
    slack_handle
  }
`;

export const displaySearchQuery = (isManager) => `
  query ($limit: Int!, $radius: Float!, $point: geography!, $scale: [String!]!) {
    SiteInfo(
      limit: $limit,
      where: {
        entity:{
          scale: { _in: $scale }
        }
        location: { _st_d_within: { distance: $radius, from: $point}}
      }
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
        scale
      }
      equipments {
        brand
        model
        quantity
      }
    }
  }
`;
