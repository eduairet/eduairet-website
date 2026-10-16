import path from 'node:path';

const oldPortfolioPages = ['indoctrinated-hound', '36days-of-type-2019'];

const toOldPortfolio = (source, slug) => ({
  source,
  destination: `https://eduairet.myportfolio.com/${slug}`,
  permanent: true,
});

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
    return [
      ...oldPortfolioPages.map((slug) => toOldPortfolio(`/${slug}`, slug)),
      // Search results still point here, with and without a locale.
      toOldPortfolio('/:locale(en|es)?/resources', 'resources'),
    ];
  },
};

export default nextConfig;
