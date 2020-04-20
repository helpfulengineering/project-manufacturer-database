const log = require('loglevel');

log.setLevel(log.levels.TRACE);

export async function handler(event, context) {
  // TODO: throw unauthenticated
  // TODO: throw unauthorized
  // TODO: throw rate limit

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello world ${Math.floor(Math.random() * 10)}` })
  };
}
