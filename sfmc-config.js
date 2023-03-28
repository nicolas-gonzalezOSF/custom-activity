module.exports.getConfig = (env) => ({
  key: '39548c2-1c57-4f24-b65a-93fc925e8b75',
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
      url: `https://${env}/journey/execute/`,
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
    save: {
      url: `https://${env}/journey/save/`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
    },
    publish: {
      url: `https://${env}/journey/publish/`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
    },
    validate: {
      url: `https://${env}/journey/validate/`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
    },
  },
  userInterfaces: {
    configModal: {
      url: `https://${env}/`,
      height: 350,
      width: 450,
      format: 'json',
      useJwt: true,
      fullscreen: false,
    },
  },
});
