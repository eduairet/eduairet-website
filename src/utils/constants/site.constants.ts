import type { Lang } from '@/models';

export const SITE_URL = 'https://www.eduairet.com';
export const SITE_NAME = 'Eduardo Aire Torres';
export const SITE_SHORT_NAME = 'eat';
export const PERSON_HANDLE = 'eduairet';
export const X_HANDLE = `@${PERSON_HANDLE}`;

export const PROFILE_PHOTO = '/eduardo-aire-torres.webp';
export const PROFILE_PHOTO_SRCSET = [
  '/eduardo-aire-torres-160.webp 160w',
  '/eduardo-aire-torres-256.webp 256w',
  `${PROFILE_PHOTO} 400w`,
].join(', ');

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

// Names the footer credit line links, keyed by its {placeholders}.
export const CreditLinks: Record<string, { label: string; href: string }> = {
  name: { label: SITE_NAME, href: SocialUrls.github },
  nextjs: { label: 'Next.js', href: 'https://nextjs.org' },
  react: { label: 'React', href: 'https://react.dev' },
  typescript: { label: 'TypeScript', href: 'https://www.typescriptlang.org' },
  sass: { label: 'Sass', href: 'https://sass-lang.com' },
  threejs: { label: 'three.js', href: 'https://threejs.org' },
  vercel: { label: 'Vercel', href: 'https://vercel.com' },
  claudecode: { label: 'Claude Code', href: 'https://claude.com/claude-code' },
  cursor: { label: 'Cursor', href: 'https://cursor.com' },
  font: { label: 'Degular', href: 'https://ohnotype.co/fonts/degular' },
  foundry: { label: 'OH no Type Co.', href: 'https://ohnotype.co' },
};

export const SAME_AS = [
  SocialUrls.github,
  SocialUrls.linkedin,
  SocialUrls.x,
  SocialUrls.instagram,
];

// To publish, also add a link in NavMainMenu.
export const RESOURCES_PUBLISHED = false;
