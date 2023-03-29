FROM node:18-alpine as base

# Create app directory
WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

RUN npm install -g nodemon

CMD [ "nodemon", "-L", "src/index.js" ]