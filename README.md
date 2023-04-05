# Custom Activity

This custom activity is coded to be used in a hosted docker container and SFMC, the integration with SFMC is using

## Installation - Local

First, install all dependencies: 
```bash
npm i
```
Add all environment variables in `.env` file or server

```bash
JWT=SFMC_JWT
SFMC_ACCOUNT_ID=
SFMC_CLIENT_ID=
SFMC_CLIENT_SECRET=
SFMC_SUBDOMAIN=
PORT=3000
CA_KEY=
CA_DOMAIN=HOST/ HTTPS GET
MAIN_TIMEZONE=Australia/Sydney
DATE_RSTART=07
DATE_REND=21
```

Then, run in the console: 
```bash
docker-compose up --build
```

### Installation - SFMC

1. Go to Setup > App > Installed Packages.
2. Create New.
3. Create component, server to server integration with Scopes.
  1.
  2.
  3.
  4.
  5.
4. Copy the JWT Signing Secret, Client Id and Client Secret (Used in the .env file).
5. Add a new component - Journey Builder Activity and add the name, category and the Endpoint URL.
6. Go to > Data Management > Key Management.
7. Create a new SALT Key (use https://www.browserling.com/tools/random-hex).
8. Once Created, copy the external key (.env CA_KEY) this secures the custom activity using JWT Signing Secret (https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/encode-custom-activities-using-jwt-customer-key.html).
