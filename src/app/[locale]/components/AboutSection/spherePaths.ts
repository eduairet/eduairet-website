import {
  SOLIDS,
  linesByDepth,
  poseMatrix,
  type Point,
} from '@/components/art/CardShapes/solids';

export const START_TURN = 0.6;
const RADIUS = 100;
// Leaves a rim of the disc around the sphere's outline.
const EDGE = RADIUS + 8;

const round = (value: number) => Math.round(value * RADIUS * 10) / 10;

// Every other point still draws a smooth ring and halves the markup.
const toPath = (polylines: Point[][]) =>
  polylines
    .map((line) =>
      line
        .filter((_, i) => i % 2 === 0 || i === line.length - 1)
        .map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(-y)}`)
        .join('')
    )
    .join('');

export function wireSpherePaths(turn: number) {
  const { near, far } = linesByDepth(SOLIDS.sphere, poseMatrix(0, turn, 0));
  return { near: toPath(near), far: toPath(far) };
}

export const restingSphere = () => ({
  viewBox: `${-EDGE} ${-EDGE} ${2 * EDGE} ${2 * EDGE}`,
  ...wireSpherePaths(START_TURN),
});

export type SpherePaths = ReturnType<typeof restingSphere>;
