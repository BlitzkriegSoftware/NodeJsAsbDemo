# syntax=docker/dockerfile:1

ARG NODE_VERSION=3.19
ARG API_PORT=30083

FROM node:alpine${NODE_VERSION}

ENV NODE_ENV production

WORKDIR /usr/src/app



RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN mkdir ./logs && \
    chown -R node:node ./logs && \
    chmod -R 777 ./logs

USER node

COPY . .

EXPOSE ${API_PORT}

CMD node ./index.js