FROM node:18-alpine as base

# Create app directory
WORKDIR /app

FROM base as production
ENV NODE_ENV=production

# Bundle app source
COPY . .
