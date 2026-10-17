import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { compile } from 'sass';
import { expect, test } from 'vitest';

const src = path.resolve(__dirname, '../src');
const compileScss = (file: string) =>
  compile(path.join(src, file), {
    importers: [
      {
        findFileUrl: (url) =>
          url.startsWith('@/')
            ? pathToFileURL(path.join(src, url.slice(2)))
            : null,
      },
    ],
  }).css.replace(/\s+/g, ' ');

test('project cards are never narrower than 20rem (320px)', () => {
  const css = compileScss('components/ui/ProjectCard/ProjectCard.module.scss');

  // Two 20rem cards and a 1.5rem gap, then three cards and two gaps.
  expect(css).toContain('@container (width >= 41.5rem)');
  expect(css).toContain('@container (width >= 63rem)');
  expect(css).toContain('.grid > * { flex: 0 0 100%; }');
  expect(css).toContain('justify-content: center');
});

test('only headings break a word that cannot fit', () => {
  const css = compileScss('styles/_normalize.scss');

  expect(css).toMatch(
    /h1, h2, h3, h4, h5, h6 \{[^}]*overflow-wrap: anywhere;[^}]*\}/
  );
  expect(css).not.toMatch(/\* \{[^}]*overflow-wrap/);
  expect(css).not.toMatch(/body \{[^}]*overflow-wrap/);
});
