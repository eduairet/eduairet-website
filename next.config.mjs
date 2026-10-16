import path from 'node:path';
import { oldPortfolioPages } from './oldPortfolioPages.mjs';

const toArchive = (source, slug) => ({
  source,
  destination: `https://archive.eduairet.com/${slug}`,
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
      ...oldPortfolioPages.map((slug) => toArchive(`/${slug}`, slug)),
      // Search results still point here, with and without a locale.
      toArchive('/:locale(en|es)?/resources', 'resources'),
      // Old portfolio pages the new site replaces; `/` and `/projects` then pick the language.
      { source: '/home', destination: '/', permanent: true },
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/work', destination: '/projects', permanent: true },
    ];
  },
};

export default nextConfig;
