require('dotenv').config();

module.exports.getConfig = () => ({
  key: process.env.SFMC_PAK_ID,
  workflowApiVersion: '1.1',
  metaData: {
    version: '1.0',
    icon: 'images/icon.png',
    category: 'custom',
  },
  type: 'REST',
  lang: {
    'en-US': {
      name: 'Country Send Time Calculator',
      description: 'Calculate de correct time of send depending on the country',
    },
  },
  arguments: {
    execute: {
      inArguments: [
        {
          contact_identifier: '{{Contact.Key}}',
        },
      ],
      outArguments: [],
      url: `https://${process.env.CA_DOMAIN}/journey/execute`,
      verb: 'POST',
      body: '',
      header: '',
      format: 'json',
      useJwt: true,
      timeout: 10000,
      concurrentRequests: 1,
      retryCount: 2,
      retryDelay: 1000,
    },
  },
  configurationArguments: {
    applicationExtensionKey: '1937b7a5-247d-432c-bead-3898a3428e1b',
    save: {
      url: `https://${process.env.CA_DOMAIN}/journey/save`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      customerKey: process.env.CA_KEY,
      body: '',
    },
    publish: {
      url: `https://${process.env.CA_DOMAIN}/journey/publish`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      customerKey: process.env.CA_KEY,
      body: '',
    },
    validate: {
      url: `https://${process.env.CA_DOMAIN}/journey/validate`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      customerKey: process.env.CA_KEY,
      body: '{}',
    },
    stop: {
      url: `https://${process.env.CA_DOMAIN}/journey/stop`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      customerKey: process.env.CA_KEY,
      body: '',
    },
  },
  userInterfaces: {
    configModal: {
      height: 350,
      width: 450,
      format: 'json',
      useJwt: true,
      customerKey: process.env.CA_KEY,
      fullscreen: false,
    },
  },
});
