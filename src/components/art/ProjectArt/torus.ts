// A port of vibe-coded-torus (src/lib.rs): an ASCII torus, one frame at a time.

export const TORUS_COLS = 80;
export const TORUS_ROWS = 24;

const R1 = 1;
const R2 = 2;
const K2 = 5;
const K1 = (TORUS_COLS * K2) / (8 * (R1 + R2));
const THETA_STEP = 0.07;
const PHI_STEP = 0.02;
const LUMINANCE_CHARS = '.,-~:;=!*#$@';
const SPACE = ' '.charCodeAt(0);
const NEWLINE = '\n'.charCodeAt(0);
const ROW_LENGTH = TORUS_COLS + 1;

// The rotation only changes A and B, so the circle's angles are worked out once.
const angles = (step: number) =>
  Array.from({ length: Math.floor((2 * Math.PI) / step) }, (_, i) => i * step);
const THETA = angles(THETA_STEP);
const PHI = angles(PHI_STEP);
const SIN_THETA = THETA.map(Math.sin);
const COS_THETA = THETA.map(Math.cos);
const SIN_PHI = PHI.map(Math.sin);
const COS_PHI = PHI.map(Math.cos);

const output = new Uint8Array(ROW_LENGTH * TORUS_ROWS);
const zbuffer = new Float32Array(TORUS_COLS * TORUS_ROWS);
const decoder = new TextDecoder();

export const TORUS_STEP = { a: 0.07, b: 0.03 };

export function renderTorus(a: number, b: number): string {
  output.fill(SPACE);
  zbuffer.fill(0);
  for (let row = 0; row < TORUS_ROWS; row++)
    output[row * ROW_LENGTH + TORUS_COLS] = NEWLINE;
  const sinA = Math.sin(a);
  const cosA = Math.cos(a);
  const sinB = Math.sin(b);
  const cosB = Math.cos(b);

  for (let ti = 0; ti < THETA.length; ti++) {
    const sinT = SIN_THETA[ti];
    const cosT = COS_THETA[ti];
    const circleX = R2 + R1 * cosT;
    const circleY = R1 * sinT;

    for (let pi = 0; pi < PHI.length; pi++) {
      const sinP = SIN_PHI[pi];
      const cosP = COS_PHI[pi];
      const x =
        circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
      const y =
        circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
      const z = K2 + cosA * circleX * sinP + circleY * sinA;
      const luminance =
        cosP * cosT * sinB -
        cosA * cosT * sinP -
        sinA * sinT +
        cosB * (cosA * sinT - cosT * sinA * sinP);
      const ooz = 1 / z;
      const xp = Math.trunc(TORUS_COLS / 2 + K1 * ooz * x);
      const yp = Math.trunc(TORUS_ROWS / 2 - (K1 * ooz * y) / 2);
      const cell = yp * TORUS_COLS + xp;

      if (
        luminance > 0 &&
        xp >= 0 &&
        xp < TORUS_COLS &&
        yp >= 0 &&
        yp < TORUS_ROWS &&
        ooz > zbuffer[cell]
      ) {
        zbuffer[cell] = ooz;
        const index = Math.min(
          Math.max(Math.trunc(luminance * 8), 0),
          LUMINANCE_CHARS.length - 1
        );
        output[yp * ROW_LENGTH + xp] = LUMINANCE_CHARS.charCodeAt(index);
      }
    }
  }
  return decoder.decode(output.subarray(0, output.length - 1));
}
