import type { Theme } from '@/hooks/useDarkMode';
import { pickShapes } from './pickShapes';
import { SOLIDS, poseMatrix, type SolidName } from './solids';

const STEP_MS = 1000 / 30;
const TAU = Math.PI * 2;
const TURN_SECONDS = 24;
const SWAY_X = { angle: 0.35, seconds: 11 };
const SWAY_Z = { angle: 0.3, seconds: 17 };
const MAX_STEP_SECONDS = 0.1;

// Share of the card's shorter side; large only where it fits beside the text.
const LARGE = 0.8;
const SMALL = 0.6;
// Keeps text over the lines readable (see wcag-audit.md, F-23).
const BEHIND_OPACITY = 0.15;
// Center distance from the right and bottom edges, in radii.
const INSET = 0.62;
const TEXT_GAP = 16;
const STROKE = 1;
const MAX_PIXEL_RATIO = 2;

interface Motion {
  y: number;
  time: number;
  velocity: number;
}

interface Entry {
  card: HTMLElement;
  className: string;
  canvas?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D | null;
  radius: number;
  // Shape center, in px from the right and bottom edges.
  center: number;
  width: number;
  height: number;
  alpha: number;
  pixelRatio: number;
  color: string;
  blackCard: boolean;
}

// Kept for the visit, so a locale switch keeps each card's shape and pose.
let picks: SolidName[] = [];
const motions: Motion[] = [];

export interface ShapeRuntime {
  // eslint-disable-next-line no-unused-vars
  add: (card: HTMLElement, className: string) => void;
  // eslint-disable-next-line no-unused-vars
  remove: (card: HTMLElement) => void;
  dispose: () => void;
}

// Dark theme: black cards turn right and white cards left; light flips it.
export function turnDirection(blackCard: boolean, theme: Theme): 1 | -1 {
  return blackCard === (theme === 'dark') ? 1 : -1;
}

const readTheme = (): Theme =>
  document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

// Light text means a black card.
const isLight = (color: string) => {
  const [r, g, b] = (color.match(/[\d.]+/g) ?? []).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 127;
};

export function stepMotion(
  motion: Motion,
  seconds: number,
  target: number
): void {
  motion.velocity +=
    (target - motion.velocity) * (1 - Math.exp(-seconds * 2.5));
  motion.y += motion.velocity * (TAU / TURN_SECONDS) * seconds;
  motion.time += motion.velocity * seconds;
}

const swayX = (time: number) =>
  SWAY_X.angle * Math.sin((TAU * time) / SWAY_X.seconds);
const swayZ = (time: number) =>
  SWAY_Z.angle * Math.cos((TAU * time) / SWAY_Z.seconds);

interface Options {
  // Draw each shape once and never animate, as without a hardware GPU.
  still?: boolean;
  random?: () => number;
}

export function createShapeRuntime({
  still = false,
  random = Math.random,
}: Options = {}): ShapeRuntime {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isStill = () => still || reducedMotion.matches;
  const entries = new Map<HTMLElement, Entry>();
  const visible = new Set<HTMLElement>();
  let frame = 0;
  let lastStep = -Infinity;
  let lastTime = 0;

  let order: HTMLElement[] | null = null;
  const indexOf = (card: HTMLElement) =>
    (order ??= [...entries.keys()].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    )).indexOf(card);

  const motionAt = (index: number, target: number) =>
    (motions[index] ??= {
      y: random() * TAU,
      time: random() * SWAY_Z.seconds,
      velocity: target,
    });
  const targetOf = (entry: Entry, theme = readTheme()) =>
    turnDirection(entry.blackCard, theme);

  const shapeAt = (index: number) => {
    if (picks.length <= index) {
      const extra = pickShapes(Math.max(entries.size, index + 1), random);
      picks = [...picks, ...extra.slice(picks.length)];
    }
    return picks[index];
  };

  const layout = (entry: Entry) => {
    const { card, canvas } = entry;
    if (!canvas) return;
    const width = card.clientWidth;
    const short = Math.min(width, card.clientHeight);
    const content = card.firstElementChild as HTMLElement | null;
    const textRight = content ? content.offsetLeft + content.offsetWidth : 0;
    const fits = (width - textRight - TEXT_GAP) / (1 + INSET);
    const large = Math.min(LARGE * short, fits);
    const beside = large >= SMALL * short;
    entry.radius = beside ? large : SMALL * short;
    entry.alpha = beside ? 1 : BEHIND_OPACITY;
    // Only the part inside the card: the rest would be cropped anyway.
    entry.center = entry.radius * INSET;
    const reach = Math.ceil(entry.radius + STROKE + entry.center);
    const cssWidth = Math.min(reach, width);
    const cssHeight = Math.min(reach, card.clientHeight);
    entry.pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    canvas.width = Math.ceil(cssWidth * entry.pixelRatio);
    canvas.height = Math.ceil(cssHeight * entry.pixelRatio);
    entry.width = cssWidth;
    entry.height = cssHeight;
    Object.assign(canvas.style, {
      width: `${cssWidth}px`,
      height: `${cssHeight}px`,
      right: '0',
      bottom: '0',
    });
  };

  const draw = (entry: Entry) => {
    const { canvas, context } = entry;
    if (!canvas || !context) return;
    const index = indexOf(entry.card);
    const motion = motionAt(index, targetOf(entry));
    const solid = SOLIDS[shapeAt(index)];
    const lines = solid.lines(
      poseMatrix(swayX(motion.time), motion.y, swayZ(motion.time))
    );
    const { radius, pixelRatio } = entry;
    const cx = entry.width - entry.center;
    const cy = entry.height - entry.center;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.globalAlpha = entry.alpha;
    context.strokeStyle = entry.color;
    context.lineWidth = STROKE;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    for (const line of lines)
      line.forEach(([x, y], i) => {
        const [px, py] = [cx + x * radius, cy - y * radius];
        if (i) context.lineTo(px, py);
        else context.moveTo(px, py);
      });
    context.stroke();
  };

  const mount = (entry: Entry) => {
    if (entry.canvas) return;
    const canvas = document.createElement('canvas');
    canvas.className = entry.className;
    canvas.setAttribute('aria-hidden', 'true');
    entry.canvas = canvas;
    entry.context = canvas.getContext('2d');
    entry.color = getComputedStyle(entry.card).color;
    entry.blackCard = isLight(entry.color);
    canvas.dataset.shape = shapeAt(indexOf(entry.card));
    entry.card.append(canvas);
    layout(entry);
  };

  const unmount = (entry: Entry) => {
    if (!entry.canvas) return;
    // Frees the backing store now, not at garbage collection.
    entry.canvas.width = entry.canvas.height = 0;
    entry.canvas.remove();
    entry.canvas = undefined;
    entry.context = undefined;
  };

  const tick = (now: number) => {
    frame = 0;
    if (!visible.size || document.hidden) return;
    frame = requestAnimationFrame(tick);
    // Called at the display rate; step at 30 fps.
    if (now - lastStep < STEP_MS - 1) return;
    const seconds = Math.min(
      MAX_STEP_SECONDS,
      (now - (lastTime || now)) / 1000
    );
    lastStep = lastTime = now;
    const theme = readTheme();
    for (const card of visible) {
      const entry = entries.get(card);
      if (!entry?.canvas) continue;
      const target = targetOf(entry, theme);
      // Eases through a stop into the new direction after a theme switch.
      stepMotion(motionAt(indexOf(card), target), seconds, target);
      entry.canvas.dataset.turn = target > 0 ? 'right' : 'left';
      draw(entry);
    }
  };

  const wake = () => {
    if (frame || !visible.size || document.hidden || isStill()) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };

  const viewport = new IntersectionObserver((records) => {
    for (const { target, isIntersecting } of records) {
      const entry = entries.get(target as HTMLElement);
      if (!entry) continue;
      if (isIntersecting) {
        mount(entry);
        draw(entry);
        visible.add(entry.card);
      } else visible.delete(entry.card);
    }
    wake();
  });

  const sizes = new ResizeObserver((records) => {
    for (const { target } of records) {
      const entry = entries.get(target as HTMLElement);
      if (!entry?.canvas) continue;
      layout(entry);
      draw(entry);
    }
  });

  const listeners = new AbortController();
  document.addEventListener('visibilitychange', wake, {
    signal: listeners.signal,
  });
  reducedMotion.addEventListener(
    'change',
    () => {
      if (!isStill()) return wake();
      cancelAnimationFrame(frame);
      frame = 0;
    },
    { signal: listeners.signal }
  );

  return {
    add(card, className) {
      if (entries.has(card)) return;
      entries.set(card, {
        card,
        className,
        radius: 0,
        center: 0,
        width: 0,
        height: 0,
        alpha: 1,
        pixelRatio: 1,
        color: '',
        blackCard: false,
      });
      order = null;
      viewport.observe(card);
      sizes.observe(card);
    },
    remove(card) {
      const entry = entries.get(card);
      if (!entry) return;
      viewport.unobserve(card);
      sizes.unobserve(card);
      visible.delete(card);
      unmount(entry);
      entries.delete(card);
      order = null;
    },
    dispose() {
      cancelAnimationFrame(frame);
      frame = 0;
      listeners.abort();
      viewport.disconnect();
      sizes.disconnect();
      entries.forEach(unmount);
      entries.clear();
      visible.clear();
    },
  };
}
