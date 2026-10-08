FROM node:26-alpine3.23 AS build
WORKDIR /app

# Keep in sync with "packageManager"; recent Node images no longer bundle Corepack.
RUN npm install -g pnpm@10.24.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install only the reviewed tree; fail rather than resolve new versions.
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
