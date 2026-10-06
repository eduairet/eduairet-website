import { expect, test } from 'vitest';
import Resources from '@/app/[locale]/resources/page';

test('resources page returns 404 while it is unpublished', async () => {
  const render = Resources({ params: Promise.resolve({ locale: 'en' }) });

  await expect(render).rejects.toMatchObject({
    digest: expect.stringContaining('404'),
  });
});
