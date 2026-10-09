import path from 'node:path';

const oldPortfolioPages = ['indoctrinated-hound', '36days-of-type-2019'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Unmatched URLs get a server-rendered 404 (src/app/global-not-found.tsx).
    globalNotFound: true,
  },
  sassOptions: {
    includePaths: [
      path.join(path.dirname(new URL(import.meta.url).pathname), 'src'),
    ],
  },
  async redirects() {
    return oldPortfolioPages.map((slug) => ({
      source: `/${slug}`,
      destination: `https://eduairet.myportfolio.com/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
