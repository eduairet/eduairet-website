import { describe, expect, test } from 'vitest';
import { SOLIDS, lines, poseMatrix } from '@/components/art/CardShapes/solids';

const poses = Array.from({ length: 24 }, (_, i) =>
  poseMatrix(Math.sin(i), i * 0.5, Math.cos(i * 1.3))
);

describe('card solids', () => {
  test('the pool is the 15 agreed solids in four families', () => {
    const families = Object.fromEntries(
      Object.entries(SOLIDS).map(([name, solid]) => [name, solid.family])
    );
    expect(families).toEqual({
      cube: 'boxes',
      longBox: 'boxes',
      tallPrism: 'boxes',
      parallelepiped: 'boxes',
      triangularPrism: 'prisms',
      hexagonalPrism: 'prisms',
      octagonalPrism: 'prisms',
      squarePyramid: 'pyramids',
      pentagonalPyramid: 'pyramids',
      octahedron: 'pyramids',
      sphere: 'round',
      torus: 'round',
      cylinder: 'round',
      cone: 'round',
      frustum: 'round',
    });
  });

  test('every solid stays inside the unit circle at any pose', () => {
    // One check per solid; an expect per point is slow when the suite is busy.
    for (const [name, solid] of Object.entries(SOLIDS)) {
      let farthest = 0;
      for (const m of poses)
        for (const line of lines(solid, m))
          for (const [x, y] of line)
            farthest = Math.max(farthest, Math.hypot(x, y));
      expect(farthest, name).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  test('every edge is drawn, front or back, except on the torus', () => {
    const m = poseMatrix(0.2, 0.7, 0.1);
    expect(lines(SOLIDS.cube, m)).toHaveLength(12);
    expect(lines(SOLIDS.hexagonalPrism, m)).toHaveLength(18);
    expect(lines(SOLIDS.octahedron, m)).toHaveLength(12);
    // Two rims plus the two outline lines.
    expect(lines(SOLIDS.cylinder, m)).toHaveLength(4);
    // Outline plus 7 latitudes and 8 meridian circles.
    expect(lines(SOLIDS.sphere, m)).toHaveLength(16);
  });

  test('a positive y angle turns the front to the right', () => {
    const front = (y: number) => {
      const m = poseMatrix(0, y, 0);
      // Where the point facing the viewer ends up.
      return m[0] * 0 + m[1] * 0 + m[2] * 1;
    };
    expect(front(0.3)).toBeGreaterThan(front(0));
  });

  test('the torus draws its front and hides its back', () => {
    // 12 rings of 65 samples and 24 tube circles of 33.
    const all = 12 * 65 + 24 * 33;
    for (const m of poses) {
      const drawn = lines(SOLIDS.torus, m).flat().length;
      expect(drawn).toBeGreaterThan(all * 0.25);
      expect(drawn).toBeLessThan(all * 0.7);
    }
  });
});
