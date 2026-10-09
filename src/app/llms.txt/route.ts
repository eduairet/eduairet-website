import { Dictionary, EnContent, EsContent } from '@/models';
import { SITE_NAME, SITE_URL } from '@/utils/constants';
import { indexablePages, pageUrl } from '@/utils/server';

export const dynamic = 'force-static';

const en = new Dictionary(EnContent);
const es = new Dictionary(EsContent);

// A Markdown summary of the site for language models (https://llmstxt.org),
// built from the same copy and URLs as the pages.
export function GET() {
  const links = indexablePages.flatMap((page) => [
    `- [${en.meta[page].title}](${pageUrl('en', page)}): ${en.meta[page].description}`,
    `- [${es.meta[page].title}](${pageUrl('es', page)}): ${es.meta[page].description}`,
  ]);
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
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
