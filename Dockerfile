# syntax=docker/dockerfile:1
FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock dist ./

RUN yarn --pure-lockfile --non-interactive --production

EXPOSE 7000

CMD ["node", "index.js"]
