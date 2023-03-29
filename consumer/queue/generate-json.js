const logger = require('../../utils/logger');
const { Queues } = require('../../queues');

module.exports.processGenerateJsonQ = async () => {
  logger.info(`Monitoring queue: ${Queues.generateJson.WORKER_QUEUE}`);
  Queues.generateJson.consume(async (job, correlationId, properties) => {
    try {
      logger.info(`[${correlationId}] --> Job: ${JSON.stringify(job)}`);
    } catch (err) {
      await Queues.generateJson.sendToDLQ(job, properties, err);
    }
  });
};