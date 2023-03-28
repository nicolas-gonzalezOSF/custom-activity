const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

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

  res.status(200).send({
    success: true,
  });
};

exports.save = async (_req, res) => res.status(200).json({ success: true });

exports.publish = (_req, res) => res.status(200).json({ success: true });

exports.validate = (_req, res) => res.status(200).json({ success: true });
