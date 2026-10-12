import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { Breakpoints, PHONE_QUERY } from '@/utils/constants';

const scss = readFileSync(
  path.resolve(
    __dirname,
    '../src/styles/abstracts/variables/_breakpoints.scss'
  ),
  'utf8'
);

test.each(Object.entries(Breakpoints))(
  'Breakpoints.%s matches _breakpoints.scss',
  (name, value) => {
    const match = scss.match(
      new RegExp(`^\\$breakpoint-${name}:\\s*([^;]+);`, 'm')
    );
    expect(match?.[1].trim()).toBe(`${value}px`);
  }
);

test('the phone query ends just below the md breakpoint', () => {
  expect(PHONE_QUERY).toBe('(max-width: 767.98px)');
});
