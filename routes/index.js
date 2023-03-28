const path = require('path');
const fs = require('fs');

/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (req, res) => {
  const domain = "customactivity-nicolasgonzalez.b4a.run";
  const key = process.env.CA_KEY;

  const file = path.join(__dirname, '..', 'public', 'config.json');

  const configTemplate = fs.readFileSync(file, 'utf-8');
  const config = JSON.parse(configTemplate.replace(/\$DOMAIN/g, domain));

  console.log(config);
  res.json(config);
};

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
