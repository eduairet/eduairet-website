import { MetadataRoute } from 'next';
import variables from '@/styles/abstracts/_variables.module.scss';

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
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
