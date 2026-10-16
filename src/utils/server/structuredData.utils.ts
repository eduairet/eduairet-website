import type { Dictionary, Lang } from '@/models';
import { TOOLS } from '@/app/[locale]/components/HomeSection/techStack';
import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import {
  PERSON_HANDLE,
  PROFILE_PHOTO,
  PROJECTS,
  SAME_AS,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from '@/utils/constants';
import { locales } from './localization.utils';
import {
  pageUrl,
  projectOr404,
  projectShareImage,
  projectUrl,
} from './meta.utils';

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

// The same site and person on every page, so each @id means one thing.
const websiteNode: WebSiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE_ROOT}#website`,
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_ROOT,
  inLanguage: locales,
};

const personNode = (content: Dictionary): PersonNode => ({
  '@type': 'Person',
  '@id': `${SITE_ROOT}#person`,
  name: SITE_NAME,
  alternateName: PERSON_HANDLE,
  jobTitle: content.home.subtitle.split(' · '),
  description: content.about.text,
  image: `${SITE_URL}${PROFILE_PHOTO}`,
  url: SITE_ROOT,
  sameAs: SAME_AS,
});

const websiteRef = { '@id': websiteNode['@id'] };
const personRef = { '@id': `${SITE_ROOT}#person` };

export async function buildHomeStructuredData(
  localeParam: string
): Promise<HomeStructuredData> {
  const locale = toLang(localeParam);
  const content = await getDictionary(locale);
  const homeUrl = pageUrl(locale, 'home');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      {
        '@type': 'ProfilePage',
        '@id': `${homeUrl}#profile`,
        url: homeUrl,
        inLanguage: locale,
        isPartOf: websiteRef,
        mainEntity: personNode(content),
      },
    ],
  };
}

// Escape "<" so no value can close the script tag.
export const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

const breadcrumbs = (
  locale: Lang,
  content: Dictionary,
  ...rest: { name: string; url: string }[]
) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { name: content.nav.home, url: pageUrl(locale, 'home') },
    { name: content.nav.projects, url: pageUrl(locale, 'projects') },
    ...rest,
  ].map(({ name, url }, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: url,
  })),
});

export async function buildProjectsStructuredData(localeParam: string) {
  const locale = toLang(localeParam);
  const content = await getDictionary(locale);
  const url = pageUrl(locale, 'projects');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      personNode(content),
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: content.projects.heading,
        description: content.meta.projects.description,
        inLanguage: locale,
        isPartOf: websiteRef,
        author: personRef,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: PROJECTS.map(({ slug }, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: content.projects.items[slug].title,
            url: projectUrl(locale, slug),
          })),
        },
      },
      breadcrumbs(locale, content),
    ],
  };
}

export async function buildProjectStructuredData(
  localeParam: string,
  slug: string
) {
  const locale = toLang(localeParam);
  const project = projectOr404(slug);
  const content = await getDictionary(locale);
  const item = content.projects.items[slug];
  const url = projectUrl(locale, slug);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      personNode(content),
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        url,
        mainEntityOfPage: url,
        name: item.title,
        description: item.summary,
        inLanguage: locale,
        dateCreated: project.started,
        dateModified: project.updated,
        image: `${SITE_URL}${projectShareImage(slug)}`,
        author: personRef,
        keywords: project.stack.map((key) => TOOLS[key].name).join(', '),
        ...(project.links.length && {
          sameAs: project.links.map(({ href }) => href),
        }),
        isPartOf: websiteRef,
      },
      breadcrumbs(locale, content, { name: item.title, url }),
    ],
  };
}
