import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import { TOOLS } from '@/app/[locale]/components/HomeSection/techStack';
import { PROJECTS, SITE_URL } from '@/utils/constants';
import {
  feedPath,
  generateLocaleParams,
  pageUrl,
  projectUrl,
} from '@/utils/server';

export const dynamic = 'force-static';
export const generateStaticParams = generateLocaleParams;

const escapeXml = (text: string) =>
  text.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char]!
  );

const rfc822 = (isoDate: string) => new Date(isoDate).toUTCString();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const locale = toLang((await params).locale);
  const content = await getDictionary(locale);
  const { title, description } = content.meta.projects;
  const lastChange = PROJECTS.map(({ updated }) => updated)
    .sort()
    .at(-1)!;

  const items = PROJECTS.map((project) => {
    const item = content.projects.items[project.slug];
    const url = projectUrl(locale, project.slug);
    return [
      '    <item>',
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <description>${escapeXml(item.summary)}</description>`,
      `      <pubDate>${rfc822(project.started)}</pubDate>`,
      ...project.stack.map(
        (key) => `      <category>${escapeXml(TOOLS[key].name)}</category>`
      ),
      '    </item>',
    ].join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${pageUrl(locale, 'projects')}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${locale}</language>`,
    `    <lastBuildDate>${rfc822(lastChange)}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}${feedPath(locale)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
