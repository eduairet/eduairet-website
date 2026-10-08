import { notFound } from 'next/navigation';
import type { Lang } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import {
  PERSON_HANDLE,
  PROFILE_PHOTO,
  SAME_AS,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from '@/utils/constants';
import { isLang, locales } from './localization.utils';
import { pageUrl } from './meta.utils';

// Only types Google lists in its search gallery (Profile page) plus WebSite for the site name.
interface WebSiteNode {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  alternateName: string;
  url: string;
  inLanguage: Lang[];
}

interface PersonNode {
  '@type': 'Person';
  '@id': string;
  name: string;
  alternateName: string;
  jobTitle: string[];
  description: string;
  image: string;
  url: string;
  sameAs: string[];
}

interface ProfilePageNode {
  '@type': 'ProfilePage';
  '@id': string;
  url: string;
  inLanguage: Lang;
  isPartOf: { '@id': string };
  mainEntity: PersonNode;
}

export interface HomeStructuredData {
  '@context': 'https://schema.org';
  '@graph': [WebSiteNode, ProfilePageNode];
}

const SITE_ROOT = `${SITE_URL}/`;

// Every value mirrors something visible on the home page: the h1, subtitle,
// summary, footer links, and the photo behind the logo.
export async function buildHomeStructuredData(
  locale: string
): Promise<HomeStructuredData> {
  if (!isLang(locale)) notFound();
  const content = await getDictionary(locale);
  const homeUrl = pageUrl(locale, 'home');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ROOT}#website`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_ROOT,
        inLanguage: locales,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${homeUrl}#profile`,
        url: homeUrl,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_ROOT}#website` },
        mainEntity: {
          '@type': 'Person',
          '@id': `${SITE_ROOT}#person`,
          name: SITE_NAME,
          alternateName: PERSON_HANDLE,
          jobTitle: content.home.subtitle.split(' · '),
          description: content.home.summary,
          image: `${SITE_URL}${PROFILE_PHOTO.src}`,
          url: SITE_ROOT,
          sameAs: SAME_AS,
        },
      },
    ],
  };
}

// JSON.stringify doesn't escape "<", so "</script>" in a value could end the tag early.
export const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, '\\u003c');
