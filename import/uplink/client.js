import log from "loglevel";
import aclient from "apollo-client";

const {ApolloClient} = aclient;
import inmemory from 'apollo-cache-inmemory';

const {InMemoryCache} = inmemory;
import alink from "apollo-link-http";

const {createHttpLink} = alink;
import gql from 'graphql-tag';
import fetch from 'node-fetch'
import {InsertQuery} from "./queries.js";

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
  const total = entities.length;
  log.info(`uploading ${total} entities to DB`);
  let errorCount = 0;

  for (const [i, entity] of entities.entries()) {
    log.debug(`uploading: ${i}/${total}`);
    const site = entity.sites[0]; // TODO loop
    const equipment = site.equipments[0]; // TODO loop
    const contact = entity.contacts[0];
    await client.mutate({
      mutation: gql`${InsertQuery}`,
      variables: {
        name: entity.name,
        certifications: '',
        experience: entity.experience,
        notes: entity.notes,
        email: contact.email,
        country: site.country,
        city: site.city,
        lat: site.lat,
        lng: site.lng,
        location: {
          type: "Point",
          coordinates: [site.lng, site.lat]
        },
        model: equipment.model,
        brand: "",
        quantity: equipment.quantity
      }
    })
    .then(result => log.debug(`upload success ${i}`))
    .catch(error => {
      log.error(`promise catch: problem uploading ${i}, ${entity.name}: ${error}`);
      errorCount += 1;
      log.error('moving to next item');
    });
  }
  if (errorCount > 0) {
    log.error(`total of ${errorCount} out of ${total} items failed to upload`);
  } else {
    log.info('no errors uploading!');
  }
};
