// A port of Collectible Pleasures' p5 sketch (server/public/sketch.js, letters.js).

export const WAVES_SIZE = 350;
const LETTER_WIDTH = WAVES_SIZE / 3;
const LINE_SPACE = WAVES_SIZE / 50;
const h = WAVES_SIZE;
const reps = (share: number) => (h * share) / LINE_SPACE;

type Module = [number, number, number];

export const WAVE_LETTERS: Record<string, Module[]> = {
  A: [
    [reps(0.1), 1, 0],
    [reps(0.4), 3, h * 0.1],
    [reps(0.1), 1, h * 0.5],
    [reps(0.3), 3, h * 0.6],
  ],
  B: [
    [reps(0.1), 5, 0],
    [reps(0.3), 3, h * 0.1],
    [reps(0.1), 5, h * 0.4],
    [reps(0.3), 3, h * 0.5],
    [reps(0.1), 5, h * 0.8],
  ],
  C: [
    [reps(0.1), 1, 0],
    [reps(0.1), 3, h * 0.1],
    [reps(0.5), 2, h * 0.2],
    [reps(0.1), 3, h * 0.7],
    [reps(0.1), 1, h * 0.8],
  ],
  D: [
    [reps(0.1), 5, 0],
    [reps(0.7), 3, h * 0.1],
    [reps(0.1), 5, h * 0.8],
  ],
  E: [
    [reps(0.1), 1, 0],
    [reps(0.3), 2, h * 0.1],
    [reps(0.1), 1, h * 0.4],
    [reps(0.3), 2, h * 0.5],
    [reps(0.1), 1, h * 0.8],
  ],
  F: [
    [reps(0.1), 1, 0],
    [reps(0.3), 2, h * 0.1],
    [reps(0.1), 1, h * 0.4],
    [reps(0.4), 2, h * 0.5],
  ],
  G: [
    [reps(0.1), 1, 0],
    [reps(0.1), 3, h * 0.1],
    [reps(0.2), 2, h * 0.2],
    [reps(0.1), 6, h * 0.4],
    [reps(0.3), 3, h * 0.5],
    [reps(0.1), 1, h * 0.8],
  ],
  H: [
    [reps(0.4), 3, 0],
    [reps(0.1), 1, h * 0.4],
    [reps(0.4), 3, h * 0.5],
  ],
  I: [
    [reps(0.1), 1, 0],
    [reps(0.7), 4, h * 0.1],
    [reps(0.1), 1, h * 0.8],
  ],
  J: [
    [reps(0.5), 7, 0],
    [reps(0.3), 3, h * 0.5],
    [reps(0.1), 1, h * 0.8],
  ],
  K: [
    [reps(0.4), 3, 0],
    [reps(0.1), 5, h * 0.4],
    [reps(0.4), 3, h * 0.5],
  ],
  L: [
    [reps(0.8), 2, 0],
    [reps(0.1), 1, h * 0.8],
  ],
  M: [
    [reps(0.1), 1, 0],
    [reps(0.8), 8, h * 0.1],
  ],
  N: [
    [reps(0.1), 1, 0],
    [reps(0.8), 3, h * 0.1],
  ],
  O: [
    [reps(0.1), 1, 0],
    [reps(0.7), 3, h * 0.1],
    [reps(0.1), 1, h * 0.8],
  ],
  P: [
    [reps(0.1), 5, 0],
    [reps(0.4), 3, h * 0.1],
    [reps(0.1), 5, h * 0.5],
    [reps(0.3), 2, h * 0.6],
  ],
  Q: [
    [reps(0.1), 1, 0],
    [reps(0.7), 3, h * 0.1],
    [reps(0.1), 9, h * 0.8],
  ],
  R: [
    [reps(0.1), 5, 0],
    [reps(0.3), 3, h * 0.1],
    [reps(0.1), 5, h * 0.4],
    [reps(0.4), 3, h * 0.5],
  ],
  S: [
    [reps(0.1), 1, 0],
    [reps(0.2), 3, h * 0.1],
    [reps(0.1), 2, h * 0.3],
    [reps(0.1), 1, h * 0.4],
    [reps(0.1), 7, h * 0.5],
    [reps(0.2), 3, h * 0.6],
    [reps(0.1), 1, h * 0.8],
  ],
  T: [
    [reps(0.1), 1, 0],
    [reps(0.8), 4, h * 0.1],
  ],
  U: [
    [reps(0.8), 3, 0],
    [reps(0.1), 1, h * 0.8],
  ],
  V: [
    [reps(0.8), 3, 0],
    [reps(0.1), 4, h * 0.8],
  ],
  W: [
    [reps(0.8), 8, 0],
    [reps(0.1), 1, h * 0.8],
  ],
  X: [
    [reps(0.4), 3, 0],
    [reps(0.1), 4, h * 0.4],
    [reps(0.4), 3, h * 0.5],
  ],
  Y: [
    [reps(0.5), 3, 0],
    [reps(0.4), 4, h * 0.5],
  ],
  Z: [
    [reps(0.1), 1, 0],
    [reps(0.2), 7, h * 0.1],
    [reps(0.2), 4, h * 0.3],
    [reps(0.3), 2, h * 0.5],
    [reps(0.1), 1, h * 0.8],
  ],
  ' ': [[reps(0.9), 1, 0]],
};

export const toWaveLetters = (text: string) =>
  [...text.toUpperCase()]
    .filter((char) => char in WAVE_LETTERS)
    .join('')
    .slice(0, 3);

type Random = (min: number, max: number) => number;

const radians = (degrees: number) => (degrees * Math.PI) / 180;

function setY(
  x: number,
  wave: number,
  left: number,
  right: number,
  random: Random,
  chopped = false,
  chops = 2,
  ch = { l: 0.1, r: 0.1 }
) {
  const lw = LETTER_WIDTH;
  const half = left + (right - left) / 2;
  const third = left + (right - left) / 3;
  const [a1, a2, a3, a4] = [
    x > 0 && x < lw * left,
    x > lw * right && x <= lw,
    x > lw * (half - ch.l) && x < lw * (half + ch.r),
    x > lw * third && x < lw * (third + ch.r),
  ];
  const [b1, b2, b3, b4, b5] = [
    x > lw * left,
    x <= lw * half,
    x <= lw * (half - ch.l * 2),
    x > lw * (half + ch.r) && x < lw * (half + ch.r * 2),
    x > lw * (third + ch.r) && x < lw * (third + ch.r * 2),
  ];
  const [c1, c2, c3, c4, c5] = [
    x > lw * half,
    x <= lw * right,
    x > lw * (half - ch.l * 2) && x <= lw * (half - ch.l),
    x >= lw * (half + ch.r * 2),
    x >= lw * (third + ch.r * 3),
  ];
  let [a, b, c] = [a1 || a2, b1 && b2, c1 && c2];
  if (chopped && chops === 2) {
    a = a1 || a3 || a2;
    b = (b1 && b3) || b4;
    c = c3 || (c4 && c2);
  }
  if (chopped && chops === 3) {
    a = a4;
    b = (b1 && b3) || b5;
    c = c3 || (c5 && c2);
  }
  if (a) return Math.sin(x * random(1, 3));
  if (b) return (x * Math.sin(radians(x * random(-100, 100)))) / 10;
  if (c) return (wave * Math.sin(radians(wave * random(-100, 100)))) / 10;
  return 0;
}

function waveY(kind: number, x: number, random: Random) {
  const wave = LETTER_WIDTH * 0.5;
  switch (kind) {
    case 1:
      return setY(x, wave, 0.1, 0.9, random);
    case 2:
      return setY(x, wave, 0.1, 0.4, random);
    case 3:
      return setY(x, wave, 0.1, 0.9, random, true);
    case 4:
      return setY(x, wave, 0.35, 0.65, random);
    case 5:
      return setY(x, wave, 0.1, 0.7, random);
    case 6:
      return setY(x, wave, 0.1, 0.9, random, true, 2, { l: 0.1, r: 0.01 });
    case 7:
      return setY(x, wave, 0.6, 0.9, random);
    case 8:
      return setY(x, wave, 0.1, 0.9, random, true, 3);
    default:
      return setY(x, wave, 0.1, 1, random);
  }
}

export function wavesPath(letters: string, random: Random) {
  let path = '';
  [...toWaveLetters(letters).padEnd(3, ' ')].forEach((letter, i) => {
    const left = LETTER_WIDTH * i;
    for (const [lines, kind, top] of WAVE_LETTERS[letter]) {
      for (let line = 0; line < lines; line++) {
        const offsetY = LETTER_WIDTH * 0.1 + top + line * LINE_SPACE;
        for (let x = 0; x < LETTER_WIDTH; x += 4) {
          const y = Math.abs(waveY(kind, x, random));
          path += `${x === 0 ? 'M' : 'L'}${(left + x).toFixed(1)} ${(offsetY + y).toFixed(1)}`;
        }
      }
    }
  });
  return path;
}

// Seeded, so the server and the first client render draw the same waves.
export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return (min, max) => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const unit = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return min + unit * (max - min);
  };
}

export const mathRandom: Random = (min, max) =>
  min + Math.random() * (max - min);
