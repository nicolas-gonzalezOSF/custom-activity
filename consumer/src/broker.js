const amqp = require('amqplib');
const logger = require('../utils/logger');

const delay = require('./delay');

module.exports.start = async () => {
  try {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);

    logger.info(process.env.MESSAGE_QUEUE);

    const channel = await connection.createChannel();
    
    await channel.assertQueue('tasks', { durable: true });
    await channel.prefetch(1);

    logger.info('Waiting tasks...');

    channel.consume('tasks', async (message) => {
      await delay(1000);

      const content = message.content.toString();
      const task = JSON.parse(content);

      channel.ack(message);

      logger.info(`${task.message} received!`); 
    });
  } catch (err) {
    logger.error('[AMQP] --> Fatal error creating channel', err.stack);
    throw err;
  }
};