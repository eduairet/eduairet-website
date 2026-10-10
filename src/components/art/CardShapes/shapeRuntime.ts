import { readTheme, type Theme } from '@/hooks/useDarkMode';
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

export interface ShapeCard {
  card: HTMLElement;
  // The text block the shape must not cover at full strength.
  content: HTMLElement | null;
  className: string;
}

// A card's canvas, made the first time the card scrolls into view.
interface View {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  color: string;
  blackCard: boolean;
  radius: number;
  alpha: number;
  width: number;
  height: number;
  pixelRatio: number;
  turn?: number;
}

interface Entry extends ShapeCard {
  view?: View;
}

// Kept for the visit, so a locale switch keeps each card's shape and pose.
let picks: SolidName[] = [];
const motions: Motion[] = [];

export interface ShapeRuntime {
  // eslint-disable-next-line no-unused-vars
  add: (shape: ShapeCard) => void;
  // eslint-disable-next-line no-unused-vars
  remove: (card: HTMLElement) => void;
  dispose: () => void;
}

// Dark theme: black cards turn right and white cards left; light flips it.
export function turnDirection(blackCard: boolean, theme: Theme): 1 | -1 {
  return blackCard === (theme === 'dark') ? 1 : -1;
}

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

// With `still`, each shape is drawn once and never animates.
export function createShapeRuntime({ still = false } = {}): ShapeRuntime {
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
      y: Math.random() * TAU,
      time: Math.random() * SWAY_Z.seconds,
      velocity: target,
    });

  const shapeAt = (index: number) => {
    if (picks.length <= index) {
      const extra = pickShapes(Math.max(entries.size, index + 1));
      picks = [...picks, ...extra.slice(picks.length)];
    }
    return picks[index];
  };

  const layout = ({ card, content }: Entry, view: View) => {
    const width = card.clientWidth;
    const height = card.clientHeight;
    const short = Math.min(width, height);
    const textRight = content ? content.offsetLeft + content.offsetWidth : 0;
    const fits = (width - textRight - TEXT_GAP) / (1 + INSET);
    const large = Math.min(LARGE * short, fits);
    const beside = large >= SMALL * short;
    view.radius = beside ? large : SMALL * short;
    view.alpha = beside ? 1 : BEHIND_OPACITY;
    // Only the part inside the card: the rest would be cropped anyway.
    const reach = Math.ceil(view.radius * (1 + INSET) + STROKE);
    view.width = Math.min(reach, width);
    view.height = Math.min(reach, height);
    view.pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const pixelWidth = Math.ceil(view.width * view.pixelRatio);
    const pixelHeight = Math.ceil(view.height * view.pixelRatio);
    // Resizing a canvas reallocates it, so skip it when nothing changed.
    if (view.canvas.width !== pixelWidth) view.canvas.width = pixelWidth;
    if (view.canvas.height !== pixelHeight) view.canvas.height = pixelHeight;
    view.canvas.style.width = `${view.width}px`;
    view.canvas.style.height = `${view.height}px`;
  };

  const draw = (entry: Entry, view: View, target: number) => {
    const index = indexOf(entry.card);
    const motion = motionAt(index, target);
    const { canvas, context, radius, pixelRatio } = view;
    const center = radius * INSET;
    const scale = radius * pixelRatio;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Unit coordinates, y up, centered on the shape.
    context.setTransform(
      scale,
      0,
      0,
      -scale,
      (view.width - center) * pixelRatio,
      (view.height - center) * pixelRatio
    );
    context.globalAlpha = view.alpha;
    context.strokeStyle = view.color;
    context.lineWidth = STROKE / radius;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    SOLIDS[shapeAt(index)].trace(
      poseMatrix(swayX(motion.time), motion.y, swayZ(motion.time)),
      context
    );
    context.stroke();
  };

  const mount = (entry: Entry) => {
    if (entry.view) return entry.view;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.className = entry.className;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.dataset.shape = shapeAt(indexOf(entry.card));
    const color = getComputedStyle(entry.card).color;
    const view: View = {
      canvas,
      context,
      color,
      blackCard: isLight(color),
      radius: 0,
      alpha: 1,
      width: 0,
      height: 0,
      pixelRatio: 1,
    };
    entry.card.append(canvas);
    layout(entry, view);
    return (entry.view = view);
  };

  const unmount = (entry: Entry) => {
    if (!entry.view) return;
    // Frees the backing store now, not at garbage collection.
    entry.view.canvas.width = entry.view.canvas.height = 0;
    entry.view.canvas.remove();
    entry.view = undefined;
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
      const view = entry?.view;
      if (!entry || !view) continue;
      const target = turnDirection(view.blackCard, theme);
      // Eases through a stop into the new direction after a theme switch.
      stepMotion(motionAt(indexOf(card), target), seconds, target);
      if (view.turn !== target) {
        view.turn = target;
        view.canvas.dataset.turn = target > 0 ? 'right' : 'left';
      }
      draw(entry, view, target);
    }
  };

  const wake = () => {
    if (frame || !visible.size || document.hidden || isStill()) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };

  const viewport = new IntersectionObserver((records) => {
    const theme = readTheme();
    for (const { target, isIntersecting } of records) {
      const entry = entries.get(target as HTMLElement);
      if (!entry) continue;
      if (!isIntersecting) {
        visible.delete(entry.card);
        continue;
      }
      const view = mount(entry);
      if (!view) continue;
      draw(entry, view, turnDirection(view.blackCard, theme));
      visible.add(entry.card);
    }
    wake();
  });

  const sizes = new ResizeObserver((records) => {
    const theme = readTheme();
    for (const { target } of records) {
      const entry = entries.get(target as HTMLElement);
      if (!entry?.view) continue;
      layout(entry, entry.view);
      draw(entry, entry.view, turnDirection(entry.view.blackCard, theme));
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
    add(shape) {
      if (entries.has(shape.card)) return;
      entries.set(shape.card, { ...shape });
      order = null;
      viewport.observe(shape.card);
      sizes.observe(shape.card);
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
