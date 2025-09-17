FROM node:current-alpine3.22 AS build
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
COPY next.config.mjs ./next.config.mjs

EXPOSE 3000