const log = require('loglevel');
const sub = require('date-fns/sub');

const {removeEmailCount} = require("../db/database-adapter");
const {getEmailCount} = require("../db/database-adapter");
const {insertEmailCount} = require("../db/database-adapter");
const {RateError} = require("../errors");

/**
 *
 * Increment email count, fails if over rate limit
 *
 * Internally first increases counter and removes it if over the limit.
 * This prevents concurrent request bypassing the limiter
 * @returns {number}
 */
const tryIncreaseCount = async (graphQLclient, userId, limit24hour) => {
  log.info(`incrementing email count for user ${userId}`);

  const count_pk = await insertEmailCount(graphQLclient, userId);
  log.info(`inserted limit counter, pk: ${count_pk}`);

  // check rate limit
  const since = sub(new Date(), {
    hours: 24,
  });
  const count = await getEmailCount(graphQLclient, userId, since);
  log.info(`rate last 24h is, count: ${count} out of ${limit24hour}`);

  // delete if over limit and throw error
  if (count > limit24hour) {
    log.error('rate limit exceeded');
    const removalCnt = await removeEmailCount(graphQLclient, count_pk);
    if (removalCnt > 0) {
      log.info(`removed count ${count_pk}`);
    } else {
      log.error(`Successful removal query did not remove ${count_pk}`);
    }

    throw new RateError('rate limit exceeded');
  }

  return count_pk;
};

const removeCount = (countId) => {

};

module.exports = {
  tryIncreaseCount
};
