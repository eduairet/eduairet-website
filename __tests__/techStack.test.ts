import { expect, test } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as simpleIcons from 'simple-icons';
import { Dictionary, EnContent, EsContent } from '@/models';
import {
  resolveStack,
  TOOLS,
} from '@/app/[locale]/components/HomeSection/techStack';

test.each([
  ['en', EnContent],
  ['es', EsContent],
] as const)('every %s stack key shows as an icon or a name', (_, data) => {
  const content = new Dictionary(data);
  for (const section of [content.experience, content.projects]) {
    for (const { stack } of section.items) {
      const { icons, tools } = resolveStack(stack);
      expect(icons.length + tools.length).toBe(stack.length);
    }
  }
});

test('tools without a usable logo are listed by name', () => {
  const { icons, tools } = resolveStack(['python', 'glyphs', 'illustrator']);
  expect(icons).toEqual(['python']);
  expect(tools).toEqual(['Glyphs', 'Adobe Illustrator']);
});

test('every icon matches the simple-icons logo of the same name', () => {
  const logos = Object.values(simpleIcons) as { title: string; path: string }[];
  for (const { name, Icon } of Object.values(TOOLS)) {
    if (!Icon) continue;
    const logo = logos.find((icon) => icon.title === name);
    expect(logo, name).toBeDefined();
    expect(renderToStaticMarkup(createElement(Icon))).toBe(
      `<path d="${logo?.path}"></path>`
    );
  }
});
