const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
    prependData: '@import "@/styles/_variables.module.scss";',
  },
};

module.exports = nextConfig;
