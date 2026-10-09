import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import GlobalNotFound, { metadata } from '@/app/global-not-found';

test('the global 404 renders a full page in both languages without JavaScript', () => {
  const html = renderToStaticMarkup(<GlobalNotFound />);

  expect(html).toContain('<html lang="en">');
  expect(html).toMatch(/<h1>404 - Page not found<\/h1>/);
  expect(html).toContain('<p lang="es">404 - Página no encontrada</p>');
  expect(html).toContain('href="/en"');
  expect(html).toContain('href="/es"');
  expect(metadata.title).toBe('Page not found | Eduardo Aire Torres');
});
