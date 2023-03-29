const logger = require('../utils/logger');

const broker = require('./broker');


setTimeout(function() {
  broker.start().catch((err) => {
    logger.error(`Error: ${JSON.stringify(err)}`);
  
  });
}, 15000);

