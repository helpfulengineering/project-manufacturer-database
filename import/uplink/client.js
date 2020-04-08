import log from "loglevel";
import aclient from "apollo-client";
import PromisePool from 'es6-promise-pool';

const {ApolloClient} = aclient;
import inmemory from 'apollo-cache-inmemory';

const {InMemoryCache} = inmemory;
import alink from "apollo-link-http";

const {createHttpLink} = alink;
import gql from 'graphql-tag';
import fetch from 'node-fetch'
import {InsertQuery} from "./queries.js";

const concurrency = 3; // The number of concurrent uploads

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

const mutateSingleEntity = (client, entity) => {
  const { name } = entity;
  const site = entity.sites[0]; // TODO loop
  const equipment = site.equipments[0]; // TODO loop
  const contact = entity.contacts[0];
  return client.mutate({
    mutation: gql`${InsertQuery}`,
    variables: {
      name: entity.name,
      certifications: '',
      experience: entity.experience,
      notes: entity.notes,
      scale: entity.scale,
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
  });
};

export const uploadData = async (client, entities) => {
  const total = entities.length;
  log.info(`uploading ${total} entities to DB`);
  let errorCount = 0;

  const promiseGenerator = function * () {
    for(const [i, entity] of entities.entries()) {
      log.debug(`uploading: ${i}/${total}`);
      const uploadPromise = mutateSingleEntity(client, entity)
        .then(result => log.debug(`${i} upload success`))
        .catch(error => {
          log.error(`${i} promise catch: problem uploading, ${entity.name}: ${error}`);
          log.error(`${i} moving to next item`);
          errorCount += 1;
        });
      yield uploadPromise;
    }
  };

  const promiseIterator = promiseGenerator();
  const pool = new PromisePool(promiseIterator, concurrency);
  const poolPromise = pool.start();

  try {
    await poolPromise;
  } catch(error) {
    log.error('Some promise in pool rejected: ' + error.message)
  }

  if (errorCount > 0) {
    log.error(`total of ${errorCount} out of ${total} items failed to upload`);
  } else {
    log.info('no errors uploading!');
  }
};
