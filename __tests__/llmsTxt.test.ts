import { expect, test } from 'vitest';
import { GET } from '@/app/llms.txt/route';
import { Dictionary, EnContent } from '@/models';

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
  ]) {
    expect(body).toContain(`](${url})`);
  }
});
