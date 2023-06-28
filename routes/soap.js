const { JSDOM } = require('jsdom');
const _ = require('lodash');
const logger = require('../utils/logger');
const axios = require('axios');
const xmlParser = require('xml-js');

const { SFMC_SUBDOMAIN } = process.env;

const SFMCSoapReq = async (correlationId, xml, typeRequest, typeResult) => {
  logger.info(`[${correlationId}] --> Requesting SOAP ${typeRequest}`);

  let data = xml;

  let config = {
    method: 'post',
    url: `https://${SFMC_SUBDOMAIN}.soap.marketingcloudapis.com/Service.asmx`,
    headers: {
      'Content-Type': 'text/xml',
    },
    data: data,
  };

  let axiosResponse,funcResponse;

  await axios(config)
    .then(function (response) {
      axiosResponse = {
        data: response.data,
        status: response.status,
      };
    })
    .catch(function (error) {
      axiosResponse = {
        data: error.data,
        status: error.status,
        error: error,
      };
    })
    .then(function () {
      // always executed
    });

  if (axiosResponse.status !== 200) {
    throw new Error(`Invalid response --> ${JSON.stringify(axiosResponse)}`);
  }

  // Result returned will depend on the request type
  let resultData = xmlParser.xml2json(axiosResponse.data, { compact: true, spaces: 4 });

  let JSONResponse = JSON.parse(resultData);

  // logger.info(`[${correlationId}] --> Result Response ${JSON.stringify(JSONResponse)}`);

  if (typeRequest == 'RetrieveFolderData') {
    // Check if the response has multiple results
    if (JSONResponse['soap:Envelope']['soap:Body']['RetrieveResponseMsg']['Results']) {
      const json_response = JSONResponse['soap:Envelope']['soap:Body']['RetrieveResponseMsg']['Results'];
      if (json_response.length > 1) {
        for (let o=0; o < json_response.length; o++) {
          if (json_response[o]['ContentType']['_text'] == typeResult) {
            funcResponse = { ID: json_response[o]['ID']['_text'], Name: json_response[o]['Name']['_text']};
          }
        }
      } else {
        // console.log(json_response);
        funcResponse = { ID: json_response['ID']['_text'], Name: json_response['Name']['_text']};
      }
    } else {
      console.log('No Results');
    }
  }

  if (typeRequest == 'CreateFolder') {

    const json_response = JSONResponse['soap:Envelope']['soap:Body']['CreateResponse'];
   

    if(json_response['Results']['StatusCode']['_text'] == 'OK'){
        funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    } else {
        funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    }
    
  }
  
  if (typeRequest == 'CreateDataExtension') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['CreateResponse'];

    if(json_response['Results']['StatusCode']['_text'] == 'OK'){
        funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    } else {
        funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    }
    
  }

  if (typeRequest == 'CreateSQLActivity') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['CreateResponse'];
    
    if(json_response['Results']['StatusCode']['_text'] == 'OK'){
      // console.log(json_response['Results']);
      funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text'], CustomerKey: json_response['Results']['Object']['CustomerKey']['_text'] , ObjectID : json_response['Results']['NewObjectID']['_text'], Name : json_response['Results']['Object']['Name']['_text']};
    } else {
      funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    }
  }

  if (typeRequest == 'CreateAutomation') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['CreateResponse'];

    if(json_response['Results']['StatusCode']['_text'] == 'OK'){
      funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    } else {
      funcResponse = { ID : json_response['Results']['NewID']['_text'], StatusMessage : json_response['Results']['StatusMessage']['_text'] , Status : json_response['Results']['StatusCode']['_text']};
    }
  }

  if (typeRequest == 'RetrieveAutomation') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body'];
    //console.log(json_response['RetrieveResponseMsg']['Results']);
  }

  if (typeRequest == 'RetrieveAutomationActivity') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['RetrieveResponseMsg'];

    if(json_response['Results']){
      funcResponse = { ObjectID : json_response['Results']['ObjectID']['_text'] , CustomerKey: json_response['Results']['CustomerKey']['_text'], Name: json_response['Results']['Name']['_text'], Status: json_response['OverallStatus']['_text']};
    } else {
      funcResponse = { ID : 0, StatusMessage : 'No Records Found', Status: 'Error' };
    }
  }

  if (typeRequest == 'RetrieveDataExtensionData') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['RetrieveResponseMsg'];
    if (json_response['Results']) {
      funcResponse = {
        ObjectID: json_response['Results']['ObjectID']['_text'],
        CustomerKey: json_response['Results']['CustomerKey']['_text'],
        Name: json_response['Results']['Name']['_text'],
        IsSendable: json_response['Results']['IsSendable']['_text'],
        Status: json_response['OverallStatus']['_text'],
      };
    } else {
      funcResponse = { ID: 0, StatusMessage: 'No Records Found', Status: 'Error' };
    }
  }

  if (typeRequest == 'RetrieveDataExtensionField') {
    const json_response = JSONResponse['soap:Envelope']['soap:Body']['RetrieveResponseMsg'];
    let fields = {};
    let pkFields = {};
    let pk = 0;

    if (json_response['Results']) {
      for (var i = 0,length = json_response['Results'].length; i < length; i++) {
        // logger.info(`[${correlationId}] --> ${JSON.stringify(json_response['Results'][i])}`);
        fields[i] = json_response['Results'][i]['Name']['_text'];
        if (json_response['Results'][i]['IsPrimaryKey']['_text'] == 'true') {
          pkFields[pk] = json_response['Results'][i]['Name']['_text'];
          pk += 1;
        }
      }

      // logger.info(`[${correlationId}] --> DE Fields ${JSON.stringify(fields)}`);
      // logger.info(`[${correlationId}] --> DE PK Fields ${JSON.stringify(pkFields)}`);
      funcResponse = {
        Fields: fields,
        PkFields: pkFields,
        Status: json_response['OverallStatus']['_text'],
      };
    } else {
      funcResponse = { ID: 0, StatusMessage: 'No Records Found', Status: 'Error' };
    }
  }

  logger.info(`[${correlationId}] --> SOAP Finished`);
  return funcResponse;
};

module.exports = {
  SFMCSoapReq,
};
