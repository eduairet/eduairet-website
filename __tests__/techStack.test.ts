import { expect, test } from 'vitest';
import { Dictionary, EnContent, EsContent } from '@/models';
import { resolveStack } from '@/app/[locale]/components/HomeSection/techStack';

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
  expect(icons.map((icon) => icon.title)).toEqual(['Python']);
  expect(tools).toEqual(['Glyphs', 'Adobe Illustrator']);
});
