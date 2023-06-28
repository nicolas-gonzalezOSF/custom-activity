const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const { getConfig } = require('../sfmc-config');
/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (_req, res) => res.json(getConfig());
/**
 * Render UI
 * @param req
 * @param res
 */
// eslint-disable-next-line consistent-return
exports.ui = (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');
  const data = req.body;

  // logger.info(`[${correlationId}] --> Req Body --> ${JSON.stringify(data)}`);

  res.render('index', {
    title: 'Custom Activity',
    fieldEndpoint: process.env.DEV_DOMAIN,
    dropdownOptions: [
      {
        name: 'Journey Email Send - Wait Based On Country',
        value: 'journeywaitbycountry',
      },
    ],
    checktext:
      'I acknowledge that i created the fields: Country and DateSend in the entry data extension',
  });
};

exports.login = (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');
  const data = req.body;
  logger.info(`[${correlationId}] --> Req Body --> ${JSON.stringify(data)}`);
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.token = '';
};
