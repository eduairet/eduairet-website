import { expect, test } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

const testCases = [
  { language: 'es_MX', expectedLocation: 'http://localhost:3000/es' },
  { language: 'en_US', expectedLocation: 'http://localhost:3000/en' },
];

const runTest = async (language: string, expectedLocation: string) => {
  const req = new NextRequest(new Request('http://localhost:3000'), {});
  req.headers.set('accept-language', language);

  const res = await proxy(req);

  expect(res?.status).toBe(302);
  expect(res?.headers.get('location')).toEqual(expectedLocation);
  expect(res?.headers.get('vary')).toBe('Accept-Language');
};

for (const testCase of testCases) {
  test(`Proxy - ${testCase.language}`, async () => {
    await runTest(testCase.language, testCase.expectedLocation);
  });
}

test('Proxy - keeps the path when it adds the locale', async () => {
  const req = new NextRequest(new Request('http://localhost:3000/contact'));
  req.headers.set('accept-language', 'es-MX,es;q=0.9');

  const res = await proxy(req);

  expect(res?.headers.get('location')).toBe('http://localhost:3000/es/contact');
});

test.each(['/en', '/es/contact', '/robots.txt', '/api', '/api/contact'])(
  'Proxy - lets %s through untouched',
  async (path) => {
    const res = await proxy(new NextRequest(`http://localhost:3000${path}`));
    expect(res).toBeUndefined();
  }
);

test.each(['/apiary', '/rapid/api'])(
  'Proxy - adds the locale to %s, which only looks like the API',
  async (path) => {
    const res = await proxy(new NextRequest(`http://localhost:3000${path}`));
    expect(res?.headers.get('location')).toBe(
      `http://localhost:3000/en${path}`
    );
  }
);
