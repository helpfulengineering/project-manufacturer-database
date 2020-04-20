const log = require('loglevel');
const { sub } = require('date-fns'); // Note, direct module reference somehow does not work for lambda version.

const {removeEmailCount} = require("../db/database-adapter");
const {getEmailCount} = require("../db/database-adapter");
const {insertEmailCount} = require("../db/database-adapter");
const {RateError} = require("../errors");

/**
 *
 * Increment email count, fails if over rate limit
 *
 * Internally first increases counter and removes it if over the limit.
 * This prevents concurrent request bypassing the limiter.
 * @returns {number}
 */
const tryIncreaseCount = async (graphQLclient, userId, limit24hour) => {
  log.info(`incrementing email count for user ${userId}`);

  const countPk = await insertEmailCount(graphQLclient, userId);
  log.info(`inserted limit counter, pk: ${countPk}`);

  // check rate limit
  let count;
  try {
    const since = sub(new Date(), {
      hours: 24,
    });
    count = await getEmailCount(graphQLclient, userId, since);
    log.info(`rate last 24h is, count: ${count} out of ${limit24hour}`);
  } catch (e) {
    log.error('unknown error while checking rate limit, removing optimistically inserted count');
    removeCount(graphQLclient, countPk);
    throw e;
  }

  // delete if over limit and throw error
  if (count > limit24hour) {
    log.error('rate limit exceeded');
    removeCount(graphQLclient, countPk);

    throw new RateError(`rate limit of ${limit24hour} request per 24 hours exceeded`);
  }

  return countPk;
};

const removeCount = async (graphQLclient, countPk) => {
  const removalCnt = await removeEmailCount(graphQLclient, countPk);
  if (removalCnt > 0) {
    log.info(`removed count ${countPk}`);
  } else {
    log.error(`Successful removal query did not remove ${countPk}`);
  }
};

module.exports = {
  tryIncreaseCount
};
