// eslint-disable-next-line unused-imports/no-unused-vars
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
};

module.exports = nextConfig;
