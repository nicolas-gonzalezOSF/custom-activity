require('dotenv').config();

module.exports.getConfig = () => ({
  key: '1937b7a5-247d-432c-bead-3898a3428e1b',
  workflowApiVersion: '1.1',
  metaData: {
    version: '1.0',
    icon: 'images/icon.png',
    category: 'custom',
  },
  type: 'REST',
  lang: {
    'en-US': {
      name: 'Custom Activity Nick G',
      description: '',
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
      body: 'save',
    },
    publish: {
      url: `https://${process.env.CA_DOMAIN}/journey/publish`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      body: 'publish',
    },
    validate: {
      url: `https://${process.env.CA_DOMAIN}/journey/validate`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      body: 'validate',
    },
    stop: {
      url: `https://${process.env.CA_DOMAIN}/journey/save`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
      body: 'stop',
    },
  },
  userInterfaces: {
    configModal: {
      height: 350,
      width: 450,
      format: 'json',
      useJwt: true,
      fullscreen: false,
    },
  },
});
