const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

const coalesceArray = (array, correlationId) => {
  logger.debug(`[${correlationId}] --> Coalescing:`, array);
  if (!Array.isArray(array)) {
    logger.warn(
      `[${correlationId}] --> Warning: Cannot coalesce a non-array. Check jbevent, mail are using the right key names and that Journey Builder has refreshed its Custom Activity`,
    );
    return '';
  }
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] !== '') {
      return array[i];
    }
  }
  return '';
};

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');

  logger.isInfoEnabled(
    `[${correlationId}] --> Journey Builder payload/inArguments is empty -->`,
  );
  const data = req.body;

  if (!data.inArguments || data.inArguments.length === 0) {
    logger.error(
      `[${correlationId}] --> Journey Builder payload/inArguments is empty --> ${JSON.stringify(
        data,
      )}`,
    );
    return res.status(422).send('Journey Builder inArguments is empty');
  }
  const payload = _.last(data.inArguments);

  if (!payload) {
    logger.error(
      `[${correlationId}] --> Journey Builder payload/inArguments is empty --> ${JSON.stringify(
        data,
      )}`,
    );
    return res.status(422).send('Journey Builder payload is empty');
  }

  const now = moment().tz('Australia/Sydney');
  const job = {
    created_date: now.format('YYYY-MM-DDTHH:mm:ss'),
    subscriber_key: data.inArguments[0].contact_identifier,
    country: coalesceArray(payload.country, correlationId),
  };

  console.log(JSON.stringify(job));

  res.status(200).send({
    success: true,
  });
};

exports.save = async (_req, res) => res.status(200).json({ success: true });

exports.stop = async (_req, res) => res.status(200).json({ success: true });

exports.publish = (_req, res) => res.status(200).json({ success: true });

exports.validate = (_req, res) => res.status(200).json({ success: true });
