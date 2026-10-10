// Wireframes in a unit sphere, as 2D polylines (y up) for an orthographic view.

export type Family = 'boxes' | 'prisms' | 'pyramids' | 'round';
export type Point = [number, number];
type Vec = [number, number, number];
// Row-major 3x3 rotation.
export type Matrix = number[];

interface Solid {
  family: Family;
  // eslint-disable-next-line no-unused-vars
  lines: (m: Matrix) => Point[][];
}

const TAU = Math.PI * 2;
const RING_STEPS = 96;

const multiply = (a: Matrix, b: Matrix): Matrix => {
  const out = new Array<number>(9);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      out[i * 3 + j] =
        a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return out;
};
const rotateX = (t: number): Matrix => {
  const [c, s] = [Math.cos(t), Math.sin(t)];
  return [1, 0, 0, 0, c, -s, 0, s, c];
};
const rotateY = (t: number): Matrix => {
  const [c, s] = [Math.cos(t), Math.sin(t)];
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};
const rotateZ = (t: number): Matrix => {
  const [c, s] = [Math.cos(t), Math.sin(t)];
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};
const project = (m: Matrix, [x, y, z]: Vec): Point => [
  m[0] * x + m[1] * y + m[2] * z,
  m[3] * x + m[4] * y + m[5] * z,
];

// The base tilt keeps faces from lining up with the view at zero angles.
const VIEW = rotateX(0.45);
const BASE = multiply(rotateZ(0.3), rotateX(0.2));

// A positive y turns the shape's front to the right.
export function poseMatrix(x: number, y: number, z: number): Matrix {
  return multiply(
    VIEW,
    multiply(rotateY(y), multiply(rotateX(x), multiply(rotateZ(z), BASE)))
  );
}

function fitToUnit(points: Vec[]) {
  const count = points.length;
  const center = points
    .reduce<Vec>((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0])
    .map((v) => v / count);
  const moved = points.map(
    (p) => [p[0] - center[0], p[1] - center[1], p[2] - center[2]] as Vec
  );
  const scale = 1 / Math.max(...moved.map((p) => Math.hypot(...p)));
  return moved.map((p) => p.map((v) => v * scale) as Vec);
}

function polyhedron(family: Family, vertices: Vec[], faces: number[][]) {
  const points = fitToUnit(vertices);
  const edges = new Map<string, [number, number]>();
  for (const face of faces)
    face.forEach((a, i) => {
      const b = face[(i + 1) % face.length];
      edges.set(a < b ? `${a},${b}` : `${b},${a}`, [a, b]);
    });
  const pairs = [...edges.values()];
  return {
    family,
    lines: (m: Matrix) =>
      pairs.map(([a, b]) => [project(m, points[a]), project(m, points[b])]),
  };
}

function box(width: number, height: number, depth: number, slant = 0) {
  const vertices: Vec[] = [];
  for (const y of [-height / 2, height / 2])
    for (const [x, z] of [
      [-width / 2, -depth / 2],
      [width / 2, -depth / 2],
      [width / 2, depth / 2],
      [-width / 2, depth / 2],
    ])
      vertices.push([x + (y > 0 ? slant : 0), y, z]);
  return polyhedron('boxes', vertices, [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ]);
}

const around = (sides: number, radius: number, y: number): Vec[] =>
  Array.from({ length: sides }, (_, i) => [
    radius * Math.cos((i / sides) * TAU),
    y,
    radius * Math.sin((i / sides) * TAU),
  ]);

function prism(sides: number, radius: number, height: number) {
  const vertices = [
    ...around(sides, radius, -height / 2),
    ...around(sides, radius, height / 2),
  ];
  const ring = Array.from({ length: sides }, (_, i) => i);
  const faces = [ring, ring.map((i) => i + sides)];
  for (const i of ring) {
    const next = (i + 1) % sides;
    faces.push([i, next, next + sides, i + sides]);
  }
  return polyhedron('prisms', vertices, faces);
}

function pyramid(sides: number, radius: number, height: number) {
  const vertices: Vec[] = [
    ...around(sides, radius, -height / 2),
    [0, height / 2, 0],
  ];
  const ring = Array.from({ length: sides }, (_, i) => i);
  return polyhedron('pyramids', vertices, [
    ring,
    ...ring.map((i) => [i, (i + 1) % sides, sides]),
  ]);
}

function octahedron() {
  const vertices: Vec[] = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  const faces: number[][] = [];
  for (const x of [0, 1])
    for (const y of [2, 3]) for (const z of [4, 5]) faces.push([x, y, z]);
  return polyhedron('pyramids', vertices, faces);
}

// eslint-disable-next-line no-unused-vars
type Curve = (angle: number) => Vec;

const circle = (point: Curve, m: Matrix) =>
  Array.from({ length: RING_STEPS + 1 }, (_, k) =>
    project(m, point((k / RING_STEPS) * TAU))
  );

// A solid of revolution about its own y axis, from bottom to top ring.
function revolution(rings: { y: number; r: number }[]) {
  const scale = 1 / Math.max(...rings.map(({ y, r }) => Math.hypot(y, r)));
  const fitted = rings.map(({ y, r }) => ({ y: y * scale, r: r * scale }));
  const at = (ring: { y: number; r: number }, phi: number): Vec => [
    ring.r * Math.cos(phi),
    ring.y,
    ring.r * Math.sin(phi),
  ];
  return {
    family: 'round' as const,
    lines(m: Matrix) {
      const out = fitted
        .filter((ring) => ring.r > 0)
        .map((ring) => circle((phi) => at(ring, phi), m));
      // Outline: where the side's normal is square to the view direction.
      for (let i = 0; i < fitted.length - 1; i++) {
        const [a, b] = [fitted[i], fitted[i + 1]];
        const length = Math.hypot(b.y - a.y, b.r - a.r);
        const radial = (b.y - a.y) / length;
        const axial = (a.r - b.r) / length;
        const [p, q, d] = [radial * m[6], radial * m[8], axial * m[7]];
        const size = Math.hypot(p, q);
        if (size < 1e-9 || Math.abs(d) > size) continue;
        const base = Math.atan2(q, p);
        const spread = Math.acos(-d / size);
        for (const phi of [base + spread, base - spread])
          out.push([project(m, at(a, phi)), project(m, at(b, phi))]);
      }
      return out;
    },
  };
}

function sphere(latitudes: number, meridians: number) {
  const outline = Array.from({ length: RING_STEPS + 1 }, (_, k): Point => {
    const t = (k / RING_STEPS) * TAU;
    return [Math.cos(t), Math.sin(t)];
  });
  const lats = Array.from(
    { length: latitudes },
    (_, i) => -Math.PI / 2 + ((i + 1) * Math.PI) / (latitudes + 1)
  );
  const longs = Array.from(
    { length: meridians },
    (_, i) => (i / meridians) * Math.PI
  );
  return {
    family: 'round' as const,
    lines: (m: Matrix) => [
      outline,
      ...lats.map((lat) =>
        circle(
          (u) => [
            Math.cos(lat) * Math.cos(u),
            Math.sin(lat),
            Math.cos(lat) * Math.sin(u),
          ],
          m
        )
      ),
      ...longs.map((long) =>
        circle(
          (v) => [
            Math.cos(v) * Math.cos(long),
            Math.sin(v),
            Math.cos(v) * Math.sin(long),
          ],
          m
        )
      ),
    ],
  };
}

// Outer, inner, top and bottom circles.
function torus(ring = 0.68, tube = 0.32) {
  const scale = 1 / (ring + tube);
  const [R, r] = [ring * scale, tube * scale];
  const circles = [0, Math.PI, Math.PI / 2, -Math.PI / 2].map(
    (v) => (u: number) =>
      [
        (R + r * Math.cos(v)) * Math.cos(u),
        r * Math.sin(v),
        (R + r * Math.cos(v)) * Math.sin(u),
      ] as Vec
  );
  return {
    family: 'round' as const,
    lines: (m: Matrix) => circles.map((point) => circle(point, m)),
  };
}

export const SOLIDS = {
  cube: box(1, 1, 1),
  longBox: box(2.4, 0.7, 0.7),
  tallPrism: box(0.7, 2.2, 0.7),
  parallelepiped: box(1.3, 0.9, 0.8, 0.5),
  triangularPrism: prism(3, 0.8, 1.6),
  hexagonalPrism: prism(6, 0.8, 1),
  octagonalPrism: prism(8, 0.8, 0.9),
  squarePyramid: pyramid(4, 0.9, 1.2),
  pentagonalPyramid: pyramid(5, 0.9, 1.2),
  octahedron: octahedron(),
  sphere: sphere(7, 8),
  torus: torus(),
  cylinder: revolution([
    { y: -0.8, r: 0.6 },
    { y: 0.8, r: 0.6 },
  ]),
  cone: revolution([
    { y: -0.7, r: 0.75 },
    { y: 0.9, r: 0 },
  ]),
  frustum: revolution([
    { y: -0.6, r: 0.8 },
    { y: 0.6, r: 0.42 },
  ]),
} satisfies Record<string, Solid>;

export type SolidName = keyof typeof SOLIDS;
