import type { Lang } from '@/models';

export const SITE_URL = 'https://www.eduairet.com';
export const SITE_NAME = 'Eduardo Aire Torres';
export const SITE_SHORT_NAME = 'eat';
export const PERSON_HANDLE = 'eduairet';
export const X_HANDLE = `@${PERSON_HANDLE}`;

export const ProfilePhoto = {
  full: '/eduardo-aire-torres.webp',
  small: '/eduardo-aire-torres-112.webp',
};

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export const OpenGraphLocales: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_MX',
};

export const SocialUrls = {
  github: 'https://github.com/eduairet',
  linkedin: 'https://www.linkedin.com/in/eduairet/',
  x: 'https://x.com/eduairet',
  instagram: 'https://www.instagram.com/eduairet/',
  email: 'mailto:hola@eduairet.com',
};

export const SAME_AS = [
  SocialUrls.github,
  SocialUrls.linkedin,
  SocialUrls.x,
  SocialUrls.instagram,
];

// To publish, also add a link in NavMainMenu.
export const RESOURCES_PUBLISHED = false;
