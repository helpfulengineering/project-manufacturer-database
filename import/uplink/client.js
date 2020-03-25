import log  from "loglevel";
import aclient from "apollo-client";
const { ApolloClient } = aclient;
import inmemory  from 'apollo-cache-inmemory';
const { InMemoryCache } = inmemory;
import alink from "apollo-link-http";
const { createHttpLink } = alink;
import gql from 'graphql-tag';
import fetch from 'node-fetch'
import {InsertQuery} from "./queries.js";

const cache = new inmemory.InMemoryCache();
const link = new alink.HttpLink({
  uri: 'http://localhost:4000/',
  fetch
});

export const createClient = (uri) => {
  const client = new ApolloClient({
    link: createHttpLink({
      uri,
      fetch,
      name: 'Sheet importer'
    }),
    cache: new InMemoryCache(),
  });
  return client;
};

export const uploadData = async (client, entities) => {
  log.info(`uploading ${entities.length} entities to DB`);

  for (const [i, entity] of entities.entries()) {
    log.debug(`uploading: ${i}`);
    const site = entity.sites[0]; // TODO loop
    const equipment = site.equipments[0]; // TODO loop
    await client
    .mutate({
      mutation: gql`${InsertQuery}`,
      variables: {
        name: entity.name,
        certifications: '',
        experience: entity.experience,
        country: site.country,
        city: site.city,
        lat: site.lat,
        lng: site.lng,
        model: equipment.model,
        brand: "",
        quantity: equipment.quantity
      }
    })
    .then(result => console.log(result));
  }
};
