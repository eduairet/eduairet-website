import type { MetadataRoute } from 'next';
import { EnContent } from '@/models';
import { Colors, SITE_NAME, SITE_SHORT_NAME } from '@/utils/constants';

const icon = (size: number, purpose: 'any' | 'maskable') => ({
  src: `/icon${purpose === 'maskable' ? '-maskable' : ''}-${size}x${size}.png`,
  sizes: `${size}x${size}`,
  type: 'image/png',
  purpose,
});

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: EnContent.meta.home.description,
    lang: 'en',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: Colors.black,
    theme_color: Colors.black,
    icons: [
      icon(192, 'any'),
      icon(512, 'any'),
      icon(192, 'maskable'),
      icon(512, 'maskable'),
    ],
  };
}
