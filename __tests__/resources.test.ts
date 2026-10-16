import { expect, test } from 'vitest';
import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match';
import nextConfig from '../next.config.mjs';

const redirectFor = async (path: string) => {
  const redirects = (await nextConfig.redirects?.()) ?? [];
  return redirects.find(({ source }) => getPathMatch(source)(path) !== false);
};

test.each(['/resources', '/en/resources', '/es/resources'])(
  '%s goes to the old portfolio with a permanent redirect',
  async (path) => {
    expect(await redirectFor(path)).toMatchObject({
      destination: 'https://eduairet.myportfolio.com/resources',
      permanent: true,
    });
  }
);

test.each(['/fr/resources', '/en/resources/old', '/en/projects'])(
  '%s is not sent to the old portfolio',
  async (path) => {
    expect(await redirectFor(path)).toBeUndefined();
  }
);

test('the older portfolio pages keep their redirects', async () => {
  expect(await redirectFor('/indoctrinated-hound')).toMatchObject({
    destination: 'https://eduairet.myportfolio.com/indoctrinated-hound',
    permanent: true,
  });
});
