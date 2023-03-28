const { getConfig } = require('../sfmc-config');
/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (req, res) => res.json(getConfig(process.env.CA_DOMAIN));
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
        name: 'Journey Entry',
        value: 'journeyEntry',
      },
      {
        name: 'Journey Exit',
        value: 'journeyExit',
      },
    ],
  });
};
