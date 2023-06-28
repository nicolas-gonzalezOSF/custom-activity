/* eslint-disable import/no-unresolved */
/* eslint-disable no-plusplus */
/* eslint-disable strict */
/* eslint-disable no-console */

'use strict';

// eslint-disable-next-line no-undef
const connection = new Postmonger.Session();
let payload = {};

// eslint-disable-next-line no-unused-vars
let authTokens = {};
let $form;
let eventDataextension;
let eventDefinitionKey;
let dataExtensionId;

const validateForm = function (cb) {
  $form = $('.js-settings-form');
  $form.validate({
    submitHandler: function (form) {},
    errorPlacement: function () {},
  });

  cb($form);
};

connection.on('initActivity', initialize);
connection.on('requestedTokens', onGetTokens);
connection.on('requestedEndpoints', onGetEndpoints);

connection.on('clickedNext', save);

const buttonSettings = {
  button: 'next',
  text: 'done',
  visible: true,
  enabled: false,
};

function onRender() {
  connection.trigger('requestSchema');
  connection.trigger('ready');
  connection.trigger('requestTokens');
  connection.trigger('requestEndpoints');
  connection.trigger('requestTriggerEventDefinition');

  // validation
  // eslint-disable-next-line no-shadow
  validateForm(($form) => {
    $form.on('change click keyup input paste', 'input, textarea', () => {
      buttonSettings.enabled = $form.valid();
      connection.trigger('updateButton', buttonSettings);
    });
  });
}

// eslint-disable-next-line func-names, no-undef
window.onload = function () {
  onRender();
};

connection.on('requestedTriggerEventDefinition', (eventDefinitionModel) => {
  if (eventDefinitionModel) {
    eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    dataExtensionId = eventDefinitionModel.dataExtensionId;
  }
  // console.log('eventDefinitionKey', eventDefinitionKey);
  // console.log('eventDefinitionModel', JSON.stringify(eventDefinitionModel));
});

connection.on('requestedSchema', (data) => {
  eventDataextension = data['schema'];
});

/**
 * Initialization
 * @param data
 */
function initialize(data) {
  if (data) {
    payload = data;
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));

  const aArgs = payload.arguments.execute.inArguments;
  const oArgs = {};
  for (let i = 0; i < aArgs.length; i++) {
    Object.assign(oArgs, aArgs[i]);
  }

  console.log(JSON.stringify(oArgs));

  if (oArgs.AckCheck === true) {
    $('#text').prop('checked', 'true');
  }

  validateForm(function ($form) {
    buttonSettings.enabled = $form.valid();
    connection.trigger('updateButton', buttonSettings);
  });
}

/**
 *
 *
 * @param {*} tokens
 */
function onGetTokens(tokens) {
  authTokens = tokens;
}

/**
 *
 *
 * @param {*} endpoints
 */
function onGetEndpoints(endpoints) {
  // eslint-disable-next-line no-console
  console.log(endpoints);
}

/**
 * Save settings
 */
function save() {
  let pkarrays = [];

  if ($form.valid()) {
    const DropdownOptions = $('#DropdownOptions').val();
    const AckCheck = $('#text').is(':checked');

    console.log(JSON.stringify(eventDataextension.length));

    for (let i = 1; i < eventDataextension.length; i++) {
      if (eventDataextension[i]['isPrimaryKey'] == 'true') {
        console.log(eventDataextension[i]['name']);
        console.log(eventDataextension[i]['key']);
        // pkarrays[eventDataextension[i]['name']] = eventDataextension[i]['key'];
      } else {
        console.log(eventDataextension[i]['key']);
      }
    }

    console.log(JSON.stringify(pkarrays));

    payload.arguments.execute.inArguments.push({
      DropdownOptions: DropdownOptions,
      AckCheck: AckCheck,
      subscriber_key: [`{{Contact.Key}}`],
      country: [`{{Event.${eventDefinitionKey}."country"}}`],
      eventDefinitionKey: [`${eventDefinitionKey}`],
      dataExtensionId: [`${dataExtensionId}`],
    });

    if (AckCheck === true) {
      payload.metaData.isConfigured = true;
      connection.trigger('updateActivity', payload);
      // console.log(JSON.stringify(payload));
    } else {
      payload.metaData.isConfigured = false;
      connection.trigger('updateActivity', payload);
      // console.log(JSON.stringify(payload));
    }
  }
}
