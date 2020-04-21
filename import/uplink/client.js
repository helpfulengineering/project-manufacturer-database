const log = require('loglevel');
const PromisePool =  require('es6-promise-pool');
const  {ApolloClient} = require('apollo-client');
const {InMemoryCache} = require('apollo-cache-inmemory');
const {createHttpLink} = require('apollo-link-http');
const{ setContext } = require('apollo-link-context');
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const {InsertQuery} = require('./queries.js');

const concurrentUploads = 10; // The number of concurrent uploads

const createClient = (uri, token) => {
  const httpLink = createHttpLink({
    uri,
    fetch,
    name: 'Sheet importer'
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
      is_valid_email: contact.is_valid_email,
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

const uploadData = async (client, entities) => {
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
  const pool = new PromisePool(promiseIterator, concurrentUploads);
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

module.exports = {
  createClient,
  uploadData
};
