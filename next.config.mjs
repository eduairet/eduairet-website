import path from 'node:path';

// Old project pages from when eduairet.com was an Adobe Portfolio site.
const designArchivePages = ['indoctrinated-hound', '36days-of-type-2019'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(path.dirname(new URL(import.meta.url).pathname), 'src'),
    ],
  },
  async redirects() {
    return designArchivePages.map((slug) => ({
      source: `/${slug}`,
      destination: `https://eduairet.myportfolio.com/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
