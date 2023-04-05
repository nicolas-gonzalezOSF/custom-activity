const moment = require('moment-timezone');
const lookup = require('country-code-lookup');
const changeCase = require('change-case');
const ctzc 	=	require('country-tz-currency');
const cityTimezones = require('city-timezones');
const logger = require('./logger');

const dateFormatCalc = async (correlationId, getCountry) => {
  const country = changeCase.capitalCase(getCountry);
  const country_code = lookup.byCountry(country);
  let sendDateFormated;

  // Get .env timezone date
  const now = moment().tz(process.env.MAIN_TIMEZONE).add(30, 'm');;
  const nowDate= now.format('YYYY-MM-DDTHH:mm:ss');
  logger.info(
    `[${correlationId}] --> ${process.env.MAIN_TIMEZONE} Date --> ${nowDate}`,
  );

  // Check if it has a code 
  if(!country_code){
    sendDateFormated = nowDate;
    logger.info(
      `[${correlationId}] --> ${process.env.MAIN_TIMEZONE} New Send Date --> ${sendDateFormated}`,
    );
  }else{
    // Get the cluntry code iso2
    const country_data = ctzc.getCountryByCode( country_code.iso2 );
    // Get the city capital
    const cityLookup = cityTimezones.lookupViaCity(country_data.capital);
    
    let newArray = [];
    // Checks if there is more than 1 result adn the use the country also
    if(cityLookup.length > 1){
      for(var i = 0 ; i < cityLookup.length; i++){
        if (cityLookup[i].iso2.includes(country_code.iso2)){
          newArray.push(cityLookup[i]);
        }
      }
    } else{
      newArray.push(cityLookup[0]);
    }
 
    // Transform the date to new timezone
    const countryNow = now.clone().tz(newArray[0].timezone);
    const countryDate= countryNow.format('YYYY-MM-DDTHH:mm:ss');

    logger.info(
      `[${correlationId}] --> ${newArray[0].timezone} Date --> ${countryDate}`,
    );

    // Get the date and time to see if is in the range
    const countryHours= countryNow.format('HH:mm:ss');
    const countryHour= countryHours.split(":");
    const countryDateF= countryNow.format('YYYY-MM-DD ');

    let countrySendDate;

    if (countryHour[0] >= process.env.DATE_RSTART && countryHour[0] <= process.env.DATE_REND) {
      countrySendDate = countryNow;
    } else {
      countrySendDate =  moment.tz(countryDateF+'07:'+countryHour[1]+':'+countryHour[2], "YYYY-MM-DD HH:mm:ss", newArray[0].timezone);
    }

    const sendDate = countrySendDate.clone().tz(process.env.MAIN_TIMEZONE);
    sendDateFormated = sendDate.format('YYYY-MM-DDTHH:mm:ss');

    logger.info(
      `[${correlationId}] --> ${process.env.MAIN_TIMEZONE} New Send Date --> ${sendDateFormated}`,
    );
  }

  return sendDateFormated;

};

module.exports = {
  dateFormatCalc,
};
