import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type Runtime = import('@/components/art/CardShapes/shapeRuntime').ShapeRuntime;

// jsdom has no 2D canvas, observers or frames, so all four are stubbed.
let createShapeRuntime: typeof import('@/components/art/CardShapes/shapeRuntime').createShapeRuntime;
// eslint-disable-next-line no-unused-vars
type Notify = (records: IntersectionObserverEntry[]) => void;
// eslint-disable-next-line no-unused-vars
type Frame = (time: number) => void;

let viewports: {
  callback: Notify;
  observed: Set<Element>;
  disconnected: boolean;
}[];
let frames: Map<number, Frame>;
let nextFrame: number;
let strokes: number;
let now: number;

const show = (card: Element, isIntersecting = true) => {
  const viewport = viewports[viewports.length - 1];
  viewport.callback([
    { target: card, isIntersecting } as IntersectionObserverEntry,
  ]);
};

// Runs the frames due now, one display frame apart.
const runFrames = (count: number) => {
  for (let i = 0; i < count; i++) {
    now += 1000 / 30;
    const due = [...frames.entries()];
    frames.clear();
    due.forEach(([, callback]) => callback(now));
  }
};

const makeCards = (count: number) => {
  const list = document.createElement('ul');
  document.body.append(list);
  return Array.from({ length: count }, (_, i) => {
    const card = document.createElement('li');
    card.style.color = i % 2 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    card.append(document.createElement('div'));
    Object.defineProperty(card, 'clientWidth', { value: 1000 });
    Object.defineProperty(card, 'clientHeight', { value: 360 });
    list.append(card);
    return card;
  });
};

beforeEach(async () => {
  vi.resetModules();
  ({ createShapeRuntime } =
    await import('@/components/art/CardShapes/shapeRuntime'));
  viewports = [];
  frames = new Map();
  nextFrame = 1;
  strokes = 0;
  now = 0;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observed = new Set<Element>();
      disconnected = false;
      callback: Notify;
      constructor(callback: Notify) {
        this.callback = callback;
        viewports.push(this);
      }
      observe(el: Element) {
        this.observed.add(el);
      }
      unobserve(el: Element) {
        this.observed.delete(el);
      }
      disconnect() {
        this.disconnected = true;
        this.observed.clear();
      }
    }
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.stubGlobal('requestAnimationFrame', (callback: Frame) => {
    frames.set(nextFrame, callback);
    return nextFrame++;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    (() => ({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: () => strokes++,
    })) as unknown as HTMLCanvasElement['getContext']
  );
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const start = (cards: HTMLElement[]): Runtime => {
  const runtime = createShapeRuntime();
  cards.forEach((card) => runtime.add(card, 'shape'));
  return runtime;
};

describe('card shape runtime', () => {
  test('adds a hidden canvas only once a card is in view', () => {
    const [card] = makeCards(1);
    start([card]);
    expect(card.querySelector('canvas')).toBeNull();

    show(card);
    const canvas = card.querySelector('canvas');
    expect(canvas?.className).toBe('shape');
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
    expect(strokes).toBe(1);
  });

  test('draws only the cards in view, and nothing once none is', () => {
    const [a, b] = makeCards(2);
    start([a, b]);
    show(a);
    strokes = 0;
    runFrames(10);
    // One card, about 30 steps per second.
    expect(strokes).toBeGreaterThanOrEqual(9);
    expect(b.querySelector('canvas')).toBeNull();

    show(a, false);
    runFrames(2);
    strokes = 0;
    runFrames(10);
    expect(strokes).toBe(0);
    expect(frames.size).toBe(0);
  });

  test('stops while the tab is hidden and resumes when shown', () => {
    const [card] = makeCards(1);
    start([card]);
    show(card);
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    runFrames(2);
    strokes = 0;
    runFrames(10);
    expect(strokes).toBe(0);
    expect(frames.size).toBe(0);

    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange'));
    runFrames(10);
    expect(strokes).toBeGreaterThan(0);
  });

  test('gives each card its own shape and keeps it across a locale switch', () => {
    const first = makeCards(12);
    const runtime = start(first);
    first.forEach((card) => show(card));
    const shapes = first.map(
      (card) => card.querySelector('canvas')?.dataset.shape
    );
    expect(new Set(shapes).size).toBe(12);

    // A locale switch remounts every card.
    runtime.dispose();
    document.body.innerHTML = '';
    const second = makeCards(12);
    start(second);
    second.forEach((card) => show(card));
    expect(
      second.map((card) => card.querySelector('canvas')?.dataset.shape)
    ).toEqual(shapes);
  });

  test('dispose frees every canvas, observer and frame', () => {
    const cards = makeCards(3);
    const runtime = start(cards);
    const canvases = cards.map((card) => {
      show(card);
      return card.querySelector('canvas') as HTMLCanvasElement;
    });

    runtime.dispose();
    for (const canvas of canvases) {
      expect(canvas.isConnected).toBe(false);
      expect(canvas.width).toBe(0);
    }
    expect(viewports[0].disconnected).toBe(true);
    expect(frames.size).toBe(0);
  });
});
