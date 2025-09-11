import { MetadataRoute } from 'next';
import variables from '@/styles/abstracts/variables/index.module.scss';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "eat's portfolio",
    short_name: 'eat',
    description: 'Eduardo Aire Torres portfolio',
    start_url: '/en',
    display: 'standalone',
    background_color: variables.black,
    theme_color: variables.black,
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-196x196.png',
        sizes: '196x196',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
