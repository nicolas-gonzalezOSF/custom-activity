require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { create } = require('xmlbuilder2');
const logger = require('../utils/logger');
const sfmcRouter = require('./sfmc');
const soapReq = require('./soap');

const MID = process.env.SFMC_ACCOUNT_ID;

const retrieveDataExtensionXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating XML to retrieve dat aextension information`);

  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1',
      }).txt('Retrieve').up()
      .ele('a:To', {
        's:mustUnderstand': '1',
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com',
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      })
      .ele('RetrieveRequestMsg', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('RetrieveRequest')
      .ele('ObjectType').txt('DataExtension').up()
      .ele('Properties').txt('ObjectID').up()
      .ele('Properties').txt('CustomerKey').up()
      .ele('Properties').txt('Name').up()
      .ele('Properties').txt('IsSendable').up()
      .ele('Properties').txt('SendableSubscriberField.Name').up()
      .ele('ns1:Filter', {
        'xmlns:ns1': 'http://exacttarget.com/wsdl/partnerAPI',
        'xsi:type': 'ns1:SimpleFilterPart',
      })
      .ele('ns1:Property').txt(options.Property).up()
      .ele('ns1:SimpleOperator').txt(options.Operator).up()
      .ele('ns1:Value').txt(options.Name).up().up()
      .ele('QueryAllAccounts').txt('false').up();

    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`,
    );
  }
};

const retrieveDataExtensionFieldsXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating XML to retrieve data extension fields`);

  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1',
      }).txt('Retrieve').up()
      .ele('a:To', {
        's:mustUnderstand': '1',
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com',
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      })
      .ele('RetrieveRequestMsg', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('RetrieveRequest')
      .ele('ObjectType').txt('DataExtensionField').up()
      .ele('Properties').txt('ObjectID').up()
      .ele('Properties').txt('Client.ID').up()
      .ele('Properties').txt('CreatedDate').up()
      .ele('Properties').txt('CustomerKey').up()
      .ele('Properties').txt('DataExtension.CustomerKey').up()
      .ele('Properties').txt('DefaultValue').up()
      .ele('Properties').txt('FieldType').up()
      .ele('Properties').txt('IsPrimaryKey').up()
      .ele('Properties').txt('IsRequired').up()
      .ele('Properties').txt('MaxLength').up()
      .ele('Properties').txt('ModifiedDate').up()
      .ele('Properties').txt('Name').up()
      .ele('Properties').txt('ObjectID').up()
      .ele('Properties').txt('Ordinal').up()
      .ele('Properties').txt('Scale').up()
      .ele('ns1:Filter', {
        'xmlns:ns1': 'http://exacttarget.com/wsdl/partnerAPI',
        'xsi:type': 'ns1:SimpleFilterPart',
      })
      .ele('ns1:Property').txt(options.Property).up()
      .ele('ns1:SimpleOperator').txt(options.Operator).up()
      .ele('ns1:Value').txt(options.Name).up().up()
      .ele('QueryAllAccounts').txt('false').up();

    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`,
    );
  }
};

const createDateExtensionXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to create data extension`);
  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1',
      }).txt('Create').up()
      .ele('a:To', {
        's:mustUnderstand': '1',
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('CreateRequest', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('Objects', {
        'xsi:type': 'DataExtension',
      })
      .ele('Client')
      .ele('ID').txt(MID).up().up()
      .ele('CategoryID').txt(options.CategoryID).up()
      .ele('CustomerKey').txt(options.data.CustomerKey).up()
      .ele('Name').txt(options.data.Name).up()
      .ele('IsSendable').txt(options.data.IsSendable).up()
      .ele('Fields');
    for (let i = 0; i < options.data.deFields.length ; i++) {
      const item = root.ele('Field');
      item.ele('CustomerKey').txt(options.data.deFields[i]['CustomerKey']).up();
      item.ele('Name').txt(options.data.deFields[i]['Name']).up();
      item.ele('FieldType').txt(options.data.deFields[i]['FieldType']).up();

      if (options.data.deFields[i]['MaxLength']) {
        item.ele('MaxLength').txt(options.data.deFields[i]['MaxLength']).up();
      }

      item.ele('IsRequired').txt(options.data.deFields[i]['IsRequired']).up();
      item.ele('IsPrimaryKey').txt(options.data.deFields[i]['IsPrimaryKey']).up();
    }

    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`,
    );
  }
};

const retrieveFolderXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating XML to retrieve folder information`);

  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1',
      }).txt('Retrieve').up()
      .ele('a:To', {
        's:mustUnderstand': '1',
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com',
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      })
      .ele('RetrieveRequestMsg', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('RetrieveRequest')
      .ele('ObjectType').txt('DataFolder').up()
      .ele('Properties').txt('ID').up()
      .ele('Properties').txt('Description').up()
      .ele('Properties').txt('ParentFolder.Description').up()
      .ele('Properties').txt('Client.ID').up()
      .ele('Properties').txt('ParentFolder.CustomerKey').up()
      .ele('Properties').txt('Name').up()
      .ele('Properties').txt('ContentType').up()
      .ele('Properties').txt('ParentFolder.Name').up()
      .ele('Properties').txt('ObjectID').up()
      .ele('Properties').txt('ParentFolder.ObjectID').up()
      .ele('ns1:Filter', {
        'xmlns:ns1': 'http://exacttarget.com/wsdl/partnerAPI',
        'xsi:type': 'ns1:SimpleFilterPart',
      })
      .ele('ns1:Property').txt(options.Property).up()
      .ele('ns1:SimpleOperator').txt(options.Operator).up()
      .ele('ns1:Value').txt(options.Name).up().up()
      .ele('QueryAllAccounts').txt('false').up();

    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`,
    );
  }
};

const createFolderXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to create folder`);
  try {
      const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1'
      }).txt('Create').up()
      .ele('a:To', {
        's:mustUnderstand': '1'
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('CreateRequest', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('ns1:Objects', {
        'xmlns:ns1': 'http://exacttarget.com/wsdl/partnerAPI',
        'xsi:type': 'ns1:DataFolder'
      })
      .ele('ns1:ModifiedDate', {
        'xsi:nil': 'true'
      }).up()
      .ele('ns1:ObjectID', {
        'xsi:nil': 'true'
      }).up()
      .ele('ns1:CustomerKey').txt(options.CustomerKey).up()
      .ele('ns1:ParentFolder', {
        'xsi:nil': 'true'
      })
      .ele('ns1:ModifiedDate', {
        'xsi:nil': 'true'
      }).up()
      .ele('ns1:ID').txt(options.ParentFolderId).up()
      .ele('ns1:ObjectID', {
        'xsi:nil': 'true'
      }).up().up()

      .ele('ns1:Name').txt(options.Name).up()
      .ele('ns1:Description').txt(options.Description).up()
      .ele('ns1:ContentType').txt(options.ContentType).up()
      .ele('ns1:IsActive').txt(options.IsActive).up()
      .ele('ns1:IsEditable').txt(options.IsEditable).up()
      .ele('ns1:AllowChildren').txt(options.AllowChildren).up()

      ;
    
    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
};

const createAutomationQueryXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to create data extension`);
  try {
      const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1'
      }).txt('Create').up()
      .ele('a:To', {
        's:mustUnderstand': '1'
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('CreateRequest', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('Objects', {
        'xsi:type': 'QueryDefinition'
      })
      .ele('CategoryID').txt(options.CategoryID).up()
      .ele('CustomerKey').txt(options.data.CustomerKey).up()
      .ele('Name').txt(options.data.Name).up()
      .ele('QueryText').txt(options.data.QueryText).up()
      .ele('TargetType').txt(options.data.TargetType).up()

      .ele('DataExtensionTarget')
      .ele('CustomerKey').txt(options.data.DataExtensionTargetCustomerKey).up()
      .ele('Name').txt(options.data.DataExtensionTargetName).up().up()
      .ele('TargetUpdateType').txt(options.data.TargetUpdateType).up()     
      ;
    
    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
};

const retrieveAutomationSqlXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to retrieve an automation SLQ Activity`);
  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1'
      }).txt('Retrieve').up()
      .ele('a:To', {
        's:mustUnderstand': '1'
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('RetrieveRequestMsg', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('RetrieveRequest')

      .ele('ObjectType').txt('QueryDefinition').up()
      .ele('Properties').txt('Name').up()
      .ele('Properties').txt('Status').up()
      .ele('Properties').txt('CustomerKey').up()
      .ele('Properties').txt('ObjectID').up()
      .ele('Filter', {
        'xsi:type': 'ComplexFilterPart'
      })
      .ele('LeftOperand', {
        'xsi:type': 'SimpleFilterPart'
      })
      .ele('Property').txt(options.LeftOperand.Property).up()
      .ele('SimpleOperator').txt(options.LeftOperand.Operator).up()
      .ele('Value').txt(options.LeftOperand.Name).up().up()
      .ele('LogicalOperator').txt('AND').up()
      .ele('RightOperand', {
        'xsi:type': 'SimpleFilterPart'
      })
      .ele('Property').txt(options.RightOperand.Property).up()
      .ele('SimpleOperator').txt(options.RightOperand.Operator).up()
      .ele('Value').txt(options.RightOperand.Name).up().up();
      // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
};

const createAutomationXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to create data extension`);
  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1'
      }).txt('Create').up()
      .ele('a:To', {
        's:mustUnderstand': '1'
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('CreateRequest', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('Objects', {
        'xsi:type': 'Automation'
      })
      .ele('Name').txt(options.AutomationActivities.Name).up()
      .ele('CustomerKey').txt(options.AutomationActivities.CustomerKey).up()
      .ele('AutomationTasks')
      .ele('AutomationTask')
      .ele('Name').txt('Load Data Views').up()
      .ele('Activities');

    for (let i = 0; i < options.data.length; i++) {
      const item = root.ele('Activity');
        item.ele('ObjectID').txt(options.data[i]['ObjectID']).up();
        item.ele('ActivityObject', {
          'xsi:type': 'QueryDefinition',
        })
        .ele('ObjectID').txt(options.data[i]['ObjectID']).up()
        .ele('CustomerKey').txt(options.data[i]['CustomerKey']).up()
        .ele('Name').txt(options.data[i]['Name']).up().up();
    }
    root.up().up().up()
      .ele('AutomationType').txt('scheduled').up();

    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
};

const retrieveAutomationXml = async (correlationId, token, options) => {
  logger.info(`[${correlationId}] --> Creating Xml to retrieve an automation`);
  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('s:Envelope', {
        'xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
        'xmlns:u':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      })
      .ele('s:Header')
      .ele('a:Action', {
        's:mustUnderstand': '1'
      }).txt('Retrieve').up()
      .ele('a:To', {
        's:mustUnderstand': '1'
      }).txt('https://'+process.env.SFMC_SUBDOMAIN+'.soap.marketingcloudapis.com/Service.asmx').up()
      .ele('fueloauth', {
        'xmlns': 'http://exacttarget.com'
      }).txt(token)
      .up().up()
      .ele('s:Body', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('RetrieveRequestMsg', {
        'xmlns': 'http://exacttarget.com/wsdl/partnerAPI'
      })
      .ele('RetrieveRequest')

      .ele('ObjectType').txt('Automation').up()
      .ele('Properties').txt('Name').up()
      .ele('Properties').txt('Description').up()
      .ele('Properties').txt('ID').up()
      .ele('Properties').txt('InteractionObjectID').up()
      .ele('Properties').txt('CustomerKey').up()
      .ele('Properties').txt('IsActive').up()
      .ele('Properties').txt('ScheduledTime').up()
      .ele('Properties').txt('Status').up()
      .ele('Properties').txt('ProgramID').up()
      .ele('Properties').txt('AutomationType').up()
      .ele('Filter', {
        'xsi:type': 'SimpleFilterPart'
      })
      .ele('Property').txt(options.Property).up()
      .ele('SimpleOperator').txt(options.Operator).up()
      .ele('Value').txt(options.Name).up().up()
      ;
    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    return xml;
  } catch (err) {
    // request-promise will throw an error for non 2xx responses
    // eslint-disable-next-line max-len
    // throw our own error to prevent logging the entire thing which to prevent logging our client credentials
    throw new Error(
      `Invalid response status code: ${err.statusCode}. Error: ${err.message}`
    );
  }
};

const xmlrun = async (req, res) => {
  const correlationId = uuidv4().replace(/-/g, '');

  logger.info(`[${correlationId}] --> Request ${JSON.stringify(req.body)}`);
  logger.info(`[${correlationId}] --> Creating Xmls`);
  const SFMCtoken = await sfmcRouter.getJwtToken(correlationId);
  // logger.info(`[${correlationId}] --> Token ${SFMCtoken.token}`);

  // Create the XML
  const retriveDataExtensionOptions = {
    Property: 'ObjectID',
    Name: '53809d0d-1300-ee11-ba41-d4f5ef3de38e',
    Operator: 'equals',
  };
  const retrieveMainDataExtensionXml = await retrieveDataExtensionXml(
    correlationId,
    SFMCtoken.token,
    retriveDataExtensionOptions,
    'DataExtension',
  );
  // logger.info(`[${correlationId}] --> XML ${retrieveMainDataExtensionXml}`);

  // Triggers the SOAP request
  const retrieveDEResponse = await soapReq.SFMCSoapReq(
    correlationId,
    retrieveMainDataExtensionXml,
    'RetrieveDataExtensionData',
  );
  // logger.info(`[${correlationId}] --> Folder CustomerKey ${retrieveDEResponse.CustomerKey}`);

  // Create the XML
  const retriveDEFieldsOptions = {
    Property: 'DataExtension.CustomerKey',
    Name: retrieveDEResponse.CustomerKey,
    Operator: 'equals',
  };

  const retrieveDEFieldsXml = await retrieveDataExtensionFieldsXml(
    correlationId,
    SFMCtoken.token,
    retriveDEFieldsOptions,
    'DataExtensionField',
  );
  // logger.info(`[${correlationId}] --> XML ${retrieveDEFieldsXml}`);

  // Triggers the SOAP request
  const retrieveDEFeildsResponse = await soapReq.SFMCSoapReq(
    correlationId,
    retrieveDEFieldsXml,
    'RetrieveDataExtensionField',
  );

  logger.info(`[${correlationId}] --> DE PK Fields ${JSON.stringify(retrieveDEFeildsResponse)}`);

  return res.status(200).send(JSON.stringify({ dedata: JSON.stringify(retrieveDEFeildsResponse) }));
};

module.exports = {
  xmlrun,
  retrieveDataExtensionXml,
  createDateExtensionXml,
  retrieveFolderXml,
  createFolderXml,
  createAutomationQueryXml,
  createAutomationXml,
  retrieveAutomationXml,
  retrieveAutomationSqlXml,
};
