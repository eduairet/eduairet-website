import type { Lang } from '@/models';

export const SITE_URL = 'https://www.eduairet.com';
export const SITE_NAME = 'Eduardo Aire Torres';
export const SITE_SHORT_NAME = 'eat';
export const PERSON_HANDLE = 'eduairet';
export const X_HANDLE = `@${PERSON_HANDLE}`;

// The About video's first frame, shown until it plays; also Person.image.
export const PROFILE_PHOTO = '/eduardo-aire-torres.webp';
export const PROFILE_VIDEO = '/eduardo-aire-torres.mp4';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export const OpenGraphLocales: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_MX',
};

export const EMAIL_ADDRESS = 'hola@eduairet.com';
export const POSTAL_ADDRESS =
  'Boulevard Manuel Ávila Camacho 571, Col. Periodista, 11220, Miguel Hidalgo, Ciudad de México, México';

export const ARCHIVE_URL = 'https://archive.eduairet.com';

export const SocialUrls = {
  github: 'https://github.com/eduairet',
  linkedin: 'https://www.linkedin.com/in/eduairet/',
  x: 'https://x.com/eduairet',
  instagram: 'https://www.instagram.com/eduairet/',
  email: `mailto:${EMAIL_ADDRESS}`,
};

export const PRIVACY_UPDATED = '2026-10-15';

// When each page's content last changed; the sitemap's lastmod. Update on edit.
export const PAGES_UPDATED = {
  home: '2026-10-15',
  projects: '2026-10-15',
  contact: '2026-10-14',
  privacy: PRIVACY_UPDATED,
};

// Pages the privacy notice links, keyed by its {placeholders}.
export const PrivacyLinks: Record<string, string> = {
  aws: 'https://aws.amazon.com/privacy/',
  google: 'https://policies.google.com/privacy',
  adobe: 'https://www.adobe.com/privacy/policies/adobe-fonts.html',
  vercel: 'https://vercel.com/legal/privacy-policy',
  sabg: 'https://www.gob.mx/buengobierno',
  edpb: 'https://www.edpb.europa.eu/about-edpb/about-edpb/members_en',
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
  ARCHIVE_URL,
];
