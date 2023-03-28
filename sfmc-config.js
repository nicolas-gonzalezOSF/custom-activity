module.exports.getConfig = (env) => ({
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
      url: `https://${env}/journey/execute`,
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
      url: `https://${env}/journey/save`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
    },
    publish: {
      url: `https://${env}/journey/publish`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
    },
    validate: {
      url: `https://${env}/journey/validate`,
      verb: 'POST',
      format: 'json',
      useJwt: true,
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
