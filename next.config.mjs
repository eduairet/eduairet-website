import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [
      path.join(path.dirname(new URL(import.meta.url).pathname), 'src'),
    ],
  },
};

export default nextConfig;
