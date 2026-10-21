// @vitest-environment node
import { expect, test, vi } from 'vitest';
import { dynamic, GET } from '@/app/api/node-version/route';

// `connection()` refuses to run without a Next.js request. The build output
// is what proves the route stays dynamic; this checks the payload.
vi.mock('next/server', () => ({
  connection: vi.fn(async () => {}),
}));

test('GET /api/node-version reports this process and is marked temporary', async () => {
  expect(dynamic).toBe('force-dynamic');

  const response = await GET();

  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(response.headers.get('x-robots-tag')).toBe('noindex');
  await expect(response.json()).resolves.toEqual({
    node: process.version,
    temporary: true,
  });
});
