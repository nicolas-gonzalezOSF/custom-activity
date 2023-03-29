const { v4: uuidv4 } = require('uuid');

const _ = require('lodash');
const moment = require('moment-timezone');

const logger = require('../utils/logger');

class BaseQueue {
  constructor(queueName, exchanges, options) {
    this.WORKER_EXCHANGE = exchanges.workerExchange;
    this.RETRY_EXCHANGE = exchanges.retryExchange;

    this.KEY = `${queueName}`;

    if (options.prefix) {
      this.KEY = `${options.prefix}.${this.KEY}`;
      this.WORKER_EXCHANGE = `${options.prefix}.${exchanges.workerExchange}`;
      this.RETRY_EXCHANGE = `${options.prefix}.${exchanges.retryExchange}`;
    }
    this.WORKER_QUEUE = `${this.KEY}.q`;
    this.RETRY_QUEUE = `${this.KEY}.rq`;
    this.DEAD_LETTER_QUEUE = `${this.KEY}.dlq`;

    this.CONSTANT_BACKOFF = options.backoff;

    this.workerQueueOptions = {
      durable: true,
      exclusive: false,
      deadLetterExchange: this.RETRY_EXCHANGE,
    };
    if (options.maxPriority) {
      this.workerQueueOptions.maxPriority = options.maxPriority;
    }
  }

  async init(channel) {
    this.channel = channel;
    await Promise.all([
      this.channel.assertExchange(this.WORKER_EXCHANGE, 'direct', { durable: true }),
      this.channel.assertExchange(this.RETRY_EXCHANGE, 'direct', { durable: true }),
    ]);
    await Promise.all([
      this.channel.assertQueue(this.WORKER_QUEUE, this.workerQueueOptions),
      this.channel.assertQueue(this.RETRY_QUEUE, {
        durable: true,
        exclusive: false,
        deadLetterExchange: this.WORKER_EXCHANGE,
        messageTtl: this.CONSTANT_BACKOFF,
      }),
      this.channel.assertQueue(this.DEAD_LETTER_QUEUE, {
        durable: true,
        exclusive: false,
      }),
    ]);
    await Promise.all([
      this.channel.bindQueue(this.WORKER_QUEUE, this.WORKER_EXCHANGE, this.KEY),
      this.channel.bindQueue(this.RETRY_QUEUE, this.RETRY_EXCHANGE, this.KEY),
    ]);
  }

  /**
   * Send a message to DLQ
   *
   * @param {object} json - Message payload
   * @param {object} properties - Message properties
   * @param {error} err - error
   */
  sendToDLQ(json, properties, err) {
    const { correlationId } = properties;
    logger.info(
      `[${correlationId}] --> Sending to ${this.DEAD_LETTER_QUEUE} due to error:`,
      err.stack,
    );
    return this.channel.sendToQueue(
      this.DEAD_LETTER_QUEUE,
      Buffer.from(JSON.stringify(json)),
      _.merge(properties, {
        persistent: true,
        headers: {
          error: err.message,
          errStack: err.stack,
          errTime: moment().tz('Australia/Sydney').format(),
        },
      }),
    );
  }

  /**
   * Publish a message to worker queue
   *
   * @param {object} json - Message payload
   * @param {object} properties - Message properties
   */
  publish(json, properties = {}) {
    const correlationId = properties.correlationId || uuidv4().replace(/-/g, '');
    const defaultProperties = {
      persistent: true,
      contentType: 'application/json',
      correlationId,
      headers: {
        publishTime: moment().tz('Australia/Sydney').format(),
      },
    };
    logger.info(`[${correlationId}] --> Publishing to ${this.WORKER_QUEUE}`);
    logger.debug(`[${correlationId}] --> json: ${JSON.stringify(json)}`);
    return this.channel.publish(
      this.WORKER_EXCHANGE,
      this.KEY,
      Buffer.from(JSON.stringify(json)),
      _.merge(defaultProperties, properties),
    );
  }

  /**
   * Callback for handling a message taken from RabbitMQ
   *
   * @callback handlerCallback
   * @param {object} job - Message content
   * @param {string} correlationId - Message correlation id
   * @param {properties} properties - Message properties
   */

  /**
   * Consume a message from queue
   *
   * @param {handlerCallback} handler - Function to handle message
   * @param {number} maxRetries - Maximum attempts. Default: 3
   */
  consume(handler, maxRetries = 3) {
    this.channel.consume(this.WORKER_QUEUE, async (data) => {
      try {
        const xDeath = data.properties.headers['x-death'];
        const attempt = xDeath !== undefined ? xDeath[0].count + 1 : 1;
        const { correlationId } = data.properties;
        let job;
        try {
          job = JSON.parse(data.content);
        } catch (err) {
          logger.error(`[${correlationId}] --> Invalid JSON payload`);
          await this.sendToDLQ(data.content, data.properties, err);
          return await this.channel.ack(data);
        }
        try {
          logger.info(
            `[${correlationId}] --> Consumed from ${this.WORKER_QUEUE} (attempt ${attempt})`,
          );
          logger.debug(`[${correlationId}] --> json: ${JSON.stringify(job)}`);
          await handler(job, correlationId, data.properties);
          return await this.channel.ack(data);
        } catch (err) {
          logger.error(`[${correlationId}] --> ${this.WORKER_QUEUE} --> error:`, err.stack);
          if (attempt < maxRetries) {
            logger.info(
              `[${correlationId}] --> ${this.WORKER_QUEUE} --> Sending to retry queue: ${this.RETRY_QUEUE}`,
            );
            return await this.channel.nack(data, false, false);
          }
          logger.error(`[${correlationId}] --> ${this.WORKER_QUEUE} --> Exceeded retry count`);
          await this.sendToDLQ(job, data.properties, err);
          return await this.channel.ack(data);
        }
      } catch (fatalErr) {
        logger.error('Fatal error:', fatalErr);
        return process.exit(1);
      }
    });
  }
}

module.exports.BaseQueue = BaseQueue;
