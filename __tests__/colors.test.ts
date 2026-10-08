import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { Colors } from '@/utils/constants';

const scss = readFileSync(
  path.resolve(__dirname, '../src/styles/abstracts/variables/_colors.scss'),
  'utf8'
);

test.each(Object.entries(Colors))(
  'Colors.%s matches $%s in _colors.scss',
  (name, value) => {
    const match = scss.match(new RegExp(`^\\$${name}:\\s*([^;]+);`, 'm'));
    expect(match?.[1].trim()).toBe(value);
  }
);
