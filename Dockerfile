FROM node:current-alpine3.22 AS build
WORKDIR /app

# Install a pinned pnpm (keep this version in sync with "packageManager" in
# package.json). Recent Node images no longer bundle Corepack, so pin the
# version explicitly rather than installing an unpinned global pnpm.
RUN npm install -g pnpm@10.24.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --frozen-lockfile: install the exact, reviewed dependency tree and fail if the
# lockfile is out of date rather than silently resolving new versions.
RUN pnpm install --frozen-lockfile

COPY . .
COPY next.config.mjs ./next.config.mjs

EXPOSE 3000
