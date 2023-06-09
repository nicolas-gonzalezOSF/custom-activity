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

  logger.info(
    `[${correlationId}] --> Request Body ${JSON.stringify(req.body)}`,
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

  let payload = {};

  for (let i = 0; i < data.inArguments.length; i++) {
    Object.assign(payload, data.inArguments[i]);
  }

  if (!payload) {
    logger.error(
      `[${correlationId}] --> Journey Builder payload is empty --> ${JSON.stringify(
        data,
      )}`,
    );
    return res.status(422).send('Journey Builder payload is empty');
  }

  const now = moment().tz(process.env.MAIN_TIMEZONE);

  logger.info(
    `[${correlationId}] --> Request Payload ${JSON.stringify(payload)}`,
  );

  const nameArray = payload.dataExtensionFNames.toString().split(',');

  const job = {
    created_date: now.format('YYYY-MM-DDTHH:mm:ss'),
    eventDefinitionKey: coalesceArray(payload.eventDefinitionKey, correlationId),
    dataExtensionId: coalesceArray(payload.dataExtensionId, correlationId),
    country: coalesceArray(payload.country, correlationId),
  };

  for (let i = 0; i < nameArray.length; i++) {
    job[nameArray[i]] = coalesceArray(payload[nameArray[i]], correlationId);
  }

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

exports.save = async (_req, res) => res.status(200).json({ action: 'save', success: true });

exports.stop = async (_req, res) => res.status(200).json({ action: 'stop', uccess: true });

exports.publish = (_req, res) => res.status(200).json({ action: 'publish', success: true });

exports.validate = (_req, res) => res.status(200).json({ action: 'validate', success: true });
