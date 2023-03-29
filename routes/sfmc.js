const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request-promise');
const moment = require('moment-timezone');
const logger = require('../utils/logger');

const SFMC_TENANT_ID = process.env.SFMC_SUBDOMAIN;

const SFMC_WS_CRED = {
  client_id: process.env.SFMC_CLIENT_ID,
  client_secret: process.env.SFMC_CLIENT_SECRET,
  account_id: process.env.SFMC_ACCOUNT_ID,
};

const getJwtToken = async (correlationId) => {
  let response;

  logger.info(`[${correlationId}] --> Fetching SFMC credentials`);
  const options = {
    method: 'POST',
    url: `https://${SFMC_TENANT_ID}.auth.marketingcloudapis.com/v2/token`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    body: {
      grant_type: 'client_credentials',
      ...SFMC_WS_CRED,
    },
    json: true,
    resolveWithFullResponse: true,
    timeout: 20 * 1000,
  };

  try {
    response = await request(options);
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
  if (response.statusCode !== 200) {
    throw new Error(`Invalid response status code: ${response.statusCode}`);
  }

  return {
    token: response.body.access_token,
    tenantId: SFMC_TENANT_ID,
  };
};

const updateSfmcNhData = async (cred, deData, correlationId) => {
  logger.info(`[${correlationId}] --> Updating SFMC NH DATA`);
  const body = deData;

  const DE_ID = body.items[0].dataExtensionId;

  const options = {
    method: 'PUT',
    url: `https://${SFMC_TENANT_ID}.rest.marketingcloudapis.com/data/v1/async/dataextensions/${DE_ID}/rows`,
    headers: {
      authorization: `Bearer ${cred.token}`,
      'content-type': 'application/json',
    },
    body,
    json: true,
    resolveWithFullResponse: true,
    timeout: 60 * 1000,
  };

  logger.info(
    `[${correlationId}] --> Req Body --> ${JSON.stringify(
      options,
    )}`,
  );

  logger.info(`[${correlationId}] --> Updating SFMC NH DATA`);

  let response;
  try {
    response = await request(options);
    logger.info(
      `[${correlationId}] --> SFMC Response: ${response.statusCode} - ${response.body.requestId}`
    );

    if (response.statusCode !== 202) {
      throw new Error(
        `Invalid response status code: ${response.statusCode}\n${JSON.stringify(
          response.body,
        )}`,
      );
    }
    return response.body.requestId;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials 
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`,
    );
  }
};

module.exports = {
  // eslint-disable-next-line no-unused-vars
  saveData: async (correlationId, deData) => {
    const now = moment().tz('Australia/Sydney');
    const SFMCtoken = await getJwtToken(correlationId);
    const newdate = moment(now).add(15, 'm');
    const data = {
      items: [
        {
          contacId: '0000001',
          dateSend: newdate.format('YYYY-MM-DDTHH:mm:ss'),
          dataExtensionId: '627f7197-fccc-ed11-a5b7-5cba2c706158',
        },
      ],
    };

    logger.info(`[${correlationId}] --> ${JSON.stringify(deData)}`);
    // const Rid = await updateSfmcNhData(SFMCtoken, data, correlationId);
    /*
    return {
      correlationId,
      Rid,
    };
    */
  },
};
