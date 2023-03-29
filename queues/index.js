const amqplib = require('amqplib');
const config = require('config');

const { BaseQueue } = require('./base-queue');
const logger = require('../utils/logger');
const {
  CLOUDAMQP_URL,
  CLOUDAMQP_PREFETCH,
} = process.env;

const createChannel = async (concurrentJobs) => {
  try {
    const connection = await amqplib.connect(CLOUDAMQP_URL);

    connection.on('disconnect', (params) => {
      logger.error('[AMQP] --> Connection disconnected:', params);
      process.exit(1);
    });
    connection.on('close', (params) => {
      logger.error('[AMQP] --> Connection closed:', params);
      process.exit(1);
    });
    connection.on('error', (err) => {
      logger.error('[AMQP] --> Connection error:', err.stack);
      process.exit(1);
    });

    const channel = await connection.createChannel();
    // channel.on('close', (params) => {
    //   logger.error('[AMQP] --> Channel closed:', params);
    //   process.exit(1);
    // });
    // channel.on('error', (err) => {
    //   logger.error('[AMQP] --> Channel error:', err.stack);
    //   process.exit(1);
    // });

    await channel.prefetch(concurrentJobs);
    return channel;
  } catch (err) {
    logger.error('[AMQP] --> Fatal error creating channel', err.stack);
    throw err;
  }
};

class Queues {
  constructor() {
    const exchanges = {
      workerExchange: config.rabbitmq.workerExchange,
      retryExchange: config.rabbitmq.retryExchange,
    };
    const options = {
      prefix: process.env.NODE_ENV,
      backoff: config.rabbitmq.constantBackoff,
      maxPriority: 5,
    };
    this.generateJson = new BaseQueue('generateJson', exchanges, options);
  }

  async init() {
    // generateJson can consume 4 DB connections per job
    await this.generateJson.init(await createChannel(parseInt(CLOUDAMQP_PREFETCH, 10)));
  }
}

module.exports = {
  // Export as a singleton
  Queues: new Queues(),
};
