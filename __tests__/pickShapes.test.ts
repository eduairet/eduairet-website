import { describe, expect, test } from 'vitest';
import { pickShapes } from '@/components/art/CardShapes/pickShapes';
import { SOLIDS } from '@/components/art/CardShapes/solids';

// Small seeded generator, so a failing draw can be replayed.
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DRAWS = 2000;
const draws = Array.from({ length: DRAWS }, (_, seed) =>
  pickShapes(12, seeded(seed * 7919 + 1))
);

describe('pickShapes', () => {
  test('never repeats a shape on the page', () => {
    for (const picks of draws) expect(new Set(picks).size).toBe(12);
  });

  test('neighbors never share a family, across section boundaries too', () => {
    for (const picks of draws)
      for (let i = 1; i < picks.length; i++)
        expect(SOLIDS[picks[i]].family).not.toBe(SOLIDS[picks[i - 1]].family);
  });

  test('always includes the torus', () => {
    for (const picks of draws) expect(picks).toContain('torus');
  });

  test('every family shows up at least twice', () => {
    for (const picks of draws) {
      const counts: Record<string, number> = {};
      for (const name of picks)
        counts[SOLIDS[name].family] = (counts[SOLIDS[name].family] ?? 0) + 1;
      expect(Object.keys(counts)).toHaveLength(4);
      for (const n of Object.values(counts))
        expect(n).toBeGreaterThanOrEqual(2);
    }
  });

  test('every shape in the pool can come up', () => {
    const seen = new Set(draws.flat());
    expect([...seen].sort()).toEqual(Object.keys(SOLIDS).sort());
  });

  test('the same random source gives the same draw', () => {
    expect(pickShapes(12, seeded(5))).toEqual(pickShapes(12, seeded(5)));
  });
});
