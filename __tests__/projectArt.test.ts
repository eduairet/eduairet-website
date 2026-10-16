import { expect, test } from 'vitest';
import {
  renderTorus,
  TORUS_COLS,
  TORUS_ROWS,
} from '@/components/art/ProjectArt/torus';
import { asciiName, toAsciiName } from '@/components/art/ProjectArt/asciiName';
import {
  seededRandom,
  toWaveLetters,
  wavesPath,
} from '@/components/art/ProjectArt/waves';

test('the torus fills an 80 by 24 frame with the 12 luminance characters', () => {
  const frame = renderTorus(1, 0.6);
  const rows = frame.split('\n');

  expect(rows).toHaveLength(TORUS_ROWS);
  expect(rows.every((row) => row.length === TORUS_COLS)).toBe(true);
  expect(frame).toMatch(/^[ .,\-~:;=!*#$@\n]+$/);
  expect(frame.replace(/[\s]/g, '').length).toBeGreaterThan(100);
});

test('the same pose always draws the same torus', () => {
  expect(renderTorus(0.3, 0.2)).toBe(renderTorus(0.3, 0.2));
  expect(renderTorus(0.3, 0.2)).not.toBe(renderTorus(0.4, 0.2));
});

test('names are cleaned like the Python version: no accents, letters and spaces only', () => {
  expect(toAsciiName('José 2 Pavón!')).toBe('JOSE  PAVON');
});

test('a name is seven rows of its own letters, two spaces apart', () => {
  const { art, columns } = asciiName('HI');
  const rows = art.split('\n');

  expect(rows).toHaveLength(7);
  expect(rows[3]).toBe('HHHHHH  II');
  expect(columns).toBe(10);
});

test('random mode keeps the strokes but swaps the letters', () => {
  const plain = asciiName('A').art;
  const random = asciiName('A', () => 0).art;

  expect(random.replace(/\S/g, '#')).toBe(plain.replace(/\S/g, '#'));
  expect(random).toMatch(/^[A\s]+$/);
});

test('wave letters take A to Z and spaces, at most three', () => {
  expect(toWaveLetters('e4t!x y')).toBe('ETX');
  expect(toWaveLetters('a b')).toBe('A B');
});

test('a seeded drawing is repeatable, so the server and client match', () => {
  expect(wavesPath('EAT', seededRandom(1))).toBe(
    wavesPath('EAT', seededRandom(1))
  );
  expect(wavesPath('EAT', seededRandom(1))).toMatch(/^M0\.0 /);
});
