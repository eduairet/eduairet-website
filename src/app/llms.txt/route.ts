import { Dictionary, EnContent, EsContent } from '@/models';
import { PROJECTS, SITE_NAME, SITE_URL } from '@/utils/constants';
import { feedPath, indexablePages, pageUrl, projectUrl } from '@/utils/server';

export const dynamic = 'force-static';

const en = new Dictionary(EnContent);
const es = new Dictionary(EsContent);
const content = { en, es };

// Built from the same copy and URLs as the pages (https://llmstxt.org).
export function GET() {
  const links = indexablePages.flatMap((page) => [
    `- [${en.meta[page].title}](${pageUrl('en', page)}): ${en.meta[page].description}`,
    `- [${es.meta[page].title}](${pageUrl('es', page)}): ${es.meta[page].description}`,
  ]);
  const projects = PROJECTS.flatMap(({ slug }) =>
    (['en', 'es'] as const).map((locale) => {
      const { title, summary } = content[locale].projects.items[slug];
      return `- [${title}](${projectUrl(locale, slug)}): ${summary}`;
    })
  );
  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${en.meta.home.description}`,
    '',
    en.about.text,
    '',
    '## Pages',
    '',
    ...links,
    '',
    '## Projects',
    '',
    ...projects,
    '',
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [${en.projects.feed}](${SITE_URL}${feedPath('en')}): RSS`,
    `- [${es.projects.feed}](${SITE_URL}${feedPath('es')}): RSS`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
