import log  from "loglevel";
import aclient from "apollo-client";
const { ApolloClient } = aclient;
import inmemory  from 'apollo-cache-inmemory';
const { InMemoryCache } = inmemory;
import alink from "apollo-link-http";
const { createHttpLink } = alink;
import fetch from 'node-fetch'

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
    }),
    cache: new InMemoryCache(),
  });
  return client;
};

export const uploadData = (entities) => {
  log.info(`uploading ${entities.length} entities to DB`);
};
