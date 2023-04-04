# Custom Activity

This custom activity is coded to be used in a hosted docker container and SFMC, the integration with SFMC is using

## Installation - Local

First, install all dependencies: `npm i`

Add all environment variables in `.env` file or server

JWT=SFMC_JWT
SFMC_ACCOUNT_ID=
SFMC_CLIENT_ID=
SFMC_CLIENT_SECRET=
SFMC_SUBDOMAIN=
PORT=3000
CA_KEY=
CA_DOMAIN=HOST/ HTTPS GET

Then, run in the console: `docker-compose up --build`

### Installation - SFMC

1- Go to Setup > App > Installed Packages
2- Create New
3- Create component - server to server integration with Scopes for
    -
    -
    -
    -
    -
    -
4- copy the JWT Signing Secret, Client Id and Client Secret (Used in the .env file)
5- Add a new component - Journey Builder Activity and add the name, category and the Endpoint URL
6- Go to > Data Management > Key Management
7- Create a new SALT Key (use https://www.browserling.com/tools/random-hex)
8- Once Created, copy the external key (.env CA_KEY) this secures the custom activity using JWT Signing Secret (https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/encode-custom-activities-using-jwt-customer-key.html)