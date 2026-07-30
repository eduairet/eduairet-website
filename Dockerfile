FROM node:current-alpine3.22 AS build
WORKDIR /app

# Use the pnpm version pinned in package.json ("packageManager"), managed by
# Corepack, instead of installing an unpinned global pnpm.
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --frozen-lockfile: install the exact, reviewed dependency tree and fail if the
# lockfile is out of date rather than silently resolving new versions.
RUN pnpm install --frozen-lockfile

COPY . .
COPY next.config.mjs ./next.config.mjs

EXPOSE 3000
