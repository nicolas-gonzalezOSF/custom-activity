const _ = require('lodash');
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
  res.render('index', {
    title: 'Custom Activity',
    dropdownOptions: [
      {
        name: 'Journey Email Send - Wait Based On Country',
        value: 'journeywaitbycountry',
      },
    ],
    checktext: 'I acknowledge that i created the fields: country and dateSend in the entry data extension',
  });
};
