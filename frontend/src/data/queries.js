export const SCALE_FILTERS = {
  Small: "Small,Medium,Large",
  Medium: "Medium,Large",
  Large: "Large",
};

const getSiteFragment = (isManager) => `
  fragment siteFields on SiteInfo {
    pk
    city
    country
    lat
    lng
    
    entity {
      pk
      name
      experience
      notes
      
      scale
      contacts {
        ${isManager ? 'slack_handle' : ''}
        ${isManager ? 'email' : ''}
        is_valid_email
      }
    }
    equipments {
      brand
      model
      quantity
    }
  }
`;

const basicSearch = `
query ($limit: Int!, $radius: Float!, $point: geography!, $scale: [String!]!, $textQuery: String) {
  SiteInfo(
    limit: $limit,
    where: {
      entity:{
        scale: { _in: $scale }
      }
      location: { _st_d_within: { distance: $radius, from: $point}}
    }
  ) {
      ...siteFields
  }
}
`;

const textSearch = `
query ($limit: Int!, $point: geography!, $radius: Float!, $scale: [String!]!, $textQuery: String) {
    search_sites(
      args: {search: $textQuery}
      limit: $limit
      where: {
        entity:{
          scale: { _in: $scale }
        }
        location: { _st_d_within: { distance: $radius, from: $point}}
      }
    ) {
      ...siteFields
    }
  }
`;

export const displaySearchQuery = (textQuery, isManager) => `
  ${getSiteFragment(isManager)}
  
  ${textQuery ? textSearch : basicSearch}
`;

