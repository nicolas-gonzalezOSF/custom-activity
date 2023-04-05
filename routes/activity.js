const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const JWT = require('../utils/jwtDecoder');
const logger = require('../utils/logger');

const sfmcRouter = require('./sfmc');

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

// eslint-disable-next-line func-names, consistent-return
exports.execute = async (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');

  logger.info(
    `[${correlationId}] --> Executing Activity`,
  );
  const data = JWT(req.body);

  logger.info(
    `[${correlationId}] --> Req Body --> ${JSON.stringify(
      data,
    )}`,
  );

  if (!data.inArguments || data.inArguments.length === 0) {
    logger.error(
      `[${correlationId}] --> Journey Builder inArguments is empty --> ${JSON.stringify(
        data,
      )}`,
    );
    return res.status(422).send('Journey Builder inArguments is empty');
  }
  const payload = _.last(data.inArguments);

  if (!payload) {
    logger.error(
      `[${correlationId}] --> Journey Builder payload is empty --> ${JSON.stringify(
        data,
      )}`,
    );
    return res.status(422).send('Journey Builder payload is empty');
  }

  const now = moment().tz(process.env.MAIN_TIMEZONE);
  const job = {
    created_date: now.format('YYYY-MM-DDTHH:mm:ss'),
    subscriber_key: coalesceArray(payload.subscriber_key),
    eventDefinitionKey: coalesceArray(payload.eventDefinitionKey, correlationId),
    dataExtensionId: coalesceArray(payload.dataExtensionId, correlationId),
    country: coalesceArray(payload.country, correlationId),
  };

  logger.info(
    `[${correlationId}] --> Job Data --> ${JSON.stringify(
      job,
    )}`,
  );

  sfmcRouter.saveData(correlationId, job);

  res.status(200).send({
    success: true,
  });
};

exports.save = async (_req, res) => res.status(200).json({ success: true });

exports.stop = async (_req, res) => res.status(200).json({ success: true });

exports.publish = (_req, res) => res.status(200).json({ success: true });

exports.validate = (_req, res) => res.status(200).json({ success: true });
