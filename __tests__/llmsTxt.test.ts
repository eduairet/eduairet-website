import { expect, test } from 'vitest';
import { GET } from '@/app/llms.txt/route';
import { Dictionary, EnContent, EsContent } from '@/models';
import { PROJECTS } from '@/utils/constants';

test('llms.txt is Markdown with a title, a summary and every indexable page', async () => {
  const res = GET();
  const body = await res.text();

  expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
  // The checks Lighthouse's llms-txt audit applies.
  expect(body).toMatch(/^\s*#\s+.+/m);
  expect(body).toMatch(/\[.+\]\(.+\)/);
  expect(body.length).toBeGreaterThanOrEqual(50);

  expect(body.startsWith('# Eduardo Aire Torres\n')).toBe(true);
  expect(body).toContain(new Dictionary(EnContent).about.text);
  for (const url of [
    'https://www.eduairet.com/en',
    'https://www.eduairet.com/es',
    'https://www.eduairet.com/en/contact',
    'https://www.eduairet.com/es/contact',
    'https://www.eduairet.com/en/privacy',
    'https://www.eduairet.com/es/privacy',
    'https://www.eduairet.com/en/projects',
    'https://www.eduairet.com/es/projects',
  ]) {
    expect(body).toContain(`](${url})`);
  }
});

test('llms.txt lists every project in both languages with its summary', async () => {
  const body = await GET().text();
  const [en, es] = [new Dictionary(EnContent), new Dictionary(EsContent)];

  expect(body).toContain('## Projects');
  for (const { slug } of PROJECTS) {
    expect(body).toContain(
      `- [${en.projects.items[slug].title}](https://www.eduairet.com/en/projects/${slug}): ${en.projects.items[slug].summary}`
    );
    expect(body).toContain(
      `- [${es.projects.items[slug].title}](https://www.eduairet.com/es/projects/${slug}): ${es.projects.items[slug].summary}`
    );
  }
});
