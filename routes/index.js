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
exports.ui = (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');
  const data = req.body;

  logger.info(`[${correlationId}] --> Req Body --> ${JSON.stringify(data)}`);

  if (req.headers.referer) {
    return res.status(401).send('Unauthorized');
  }

  res.render('index', {
    title: 'Custom Activity',
    dropdownOptions: [
      {
        name: 'Journey Email Send - Wait Based On Country',
        value: 'journeywaitbycountry',
      },
    ],
    checktext:
      'I acknowledge that i created the fields: country and dateSend in the entry data extension',
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
