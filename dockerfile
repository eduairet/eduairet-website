FROM node:current-alpine3.22 AS build
WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN npm install -g pnpm && pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]