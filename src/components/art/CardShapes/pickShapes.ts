import { SOLIDS, type SolidName } from './solids';

const MIN_PER_FAMILY = 2;
const MAX_TRIES = 50;

// Page order: no repeats, torus in, no same-family neighbors, 2+ per family.
export function pickShapes(count: number, random = Math.random): SolidName[] {
  const names = Object.keys(SOLIDS) as SolidName[];
  const familyOf = (name: SolidName) => SOLIDS[name].family;
  const shuffled = () => {
    const list = [...names];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  let picks: (SolidName | null)[] = [];
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    picks = Array<SolidName | null>(count).fill(null);
    picks[Math.floor(random() * count)] = 'torus';
    const used = new Set<SolidName>(['torus']);
    const fits = (i: number, name: SolidName) =>
      !used.has(name) &&
      [picks[i - 1], picks[i + 1]].every(
        (next) => !next || familyOf(next) !== familyOf(name)
      );
    const fill = (i: number): boolean => {
      if (i === count) return true;
      if (picks[i]) return fill(i + 1);
      for (const name of shuffled()) {
        if (!fits(i, name)) continue;
        picks[i] = name;
        used.add(name);
        if (fill(i + 1)) return true;
        used.delete(name);
        picks[i] = null;
      }
      return false;
    };
    if (!fill(0)) continue;
    const counts = new Map<string, number>();
    for (const name of picks as SolidName[])
      counts.set(familyOf(name), (counts.get(familyOf(name)) ?? 0) + 1);
    if (
      count < 4 * MIN_PER_FAMILY ||
      (counts.size === 4 &&
        [...counts.values()].every((n) => n >= MIN_PER_FAMILY))
    )
      break;
  }
  return picks.map((name, i) => name ?? names[i % names.length]);
}
