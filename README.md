# Custom Activity

This custom activity is designed to be used in a hosted docker container with SFMC (Salesforce Marketing Cloud). The integration with SFMC is done through an installed package with API integration and Journey Builder Activity.

The custom activity reads the country from the entry source data extension in the journey, along with the current time in the SFMC timezone. It then converts the date to the contact's country and checks if the date is within a specific range of time. If the date falls within the specified range, the custom activity will add 30 minutes to the send date, transform it back to the SFMC timezone, and populate this date to a specific field in the data extension. If the date doesn't fall within the time range, it will calculate the next available date, transform it back to the SFMC timezone, and populate this date to a specific field in the data extension.

## Installation - Local

To install the custom activity locally, follow these steps:

1. Install all dependencies using the command `npm i`.
2. Add all environment variables in the `.env` file or on the server.
3. Run the following command in the console: `docker-compose up --build`.
4. Make sure to include the following environment variables in the `.env` file:

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
SFMC_PAK_ID=
```
### Installation - SFMC

To install the custom activity in SFMC, follow these steps:

1. Go to Setup > App > Installed Packages.
2. Create new package.
3. Create a component and a server-to-server integration with all the scopes needed to authorize and update a data extension.
4. Copy the JWT Signing Secret, Client Id, and Client Secret (used in the `.env` file).
5. Add a new component - Journey Builder Activity - and specify the name, category, and endpoint URL.
6. Go to Data Management > Key Management.
7. Create a new SALT Key (use https://www.browserling.com/tools/random-hex).
8. Once created, copy the external key (`.env CA_KEY`). This secures the custom activity using the JWT Signing Secret (https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/encode-custom-activities-using-jwt-customer-key.html).

### Usage

To use the custom activity, follow these steps:

1. Create the fields `country` as Text(50)  and `dateSend` as Date in the data extension.
2. Add the data extension to the Data Designer in the attribute group and link it with the contact model in a one-on-one relation.
2. Go to Journey Builder and create a multi-step journey.
3. Add a `Decision split` activity checking if the country field is not null or empty.
4. In the True Path drag and drop the custom activity.
5. Accept the acknoledgement of the fields created.
6. Add a `Wait by duration` activity of 15 min.
7. Add a `Wait by attribute` activity and select the `dateSend` field with Wait Interval on the field.
8. Add an `Email` activity.