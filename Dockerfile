# syntax=docker/dockerfile:1
FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --non-interactive --production

COPY dist ./

EXPOSE 7000

CMD ["node", "index.js"]
