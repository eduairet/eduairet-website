import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { stubWebGLRenderer } from './helpers/webgl';

const runtime = vi.hoisted(() => ({
  created: 0,
  options: [] as unknown[],
  add: vi.fn(),
  remove: vi.fn(),
  dispose: vi.fn(),
}));

vi.mock('@/components/art/CardShapes/shapeRuntime', () => ({
  createShapeRuntime: (options: unknown) => {
    runtime.created++;
    runtime.options.push(options);
    return {
      add: runtime.add,
      remove: runtime.remove,
      dispose: runtime.dispose,
    };
  },
}));

// The registry and the gate keep module state, so each test gets a fresh copy.
let showCardShape: typeof import('@/components/art/CardShapes/cardShapes').showCardShape;

beforeEach(async () => {
  vi.resetModules();
  ({ showCardShape } = await import('@/components/art/CardShapes/cardShapes'));
  vi.useFakeTimers();
  runtime.created = 0;
  runtime.options = [];
  runtime.add.mockClear();
  runtime.remove.mockClear();
  runtime.dispose.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const card = () => ({
  card: document.createElement('li'),
  content: null,
  className: 'shape',
});

const settle = () => vi.advanceTimersByTimeAsync(2000);

describe('card shapes registry', () => {
  test('loads nothing before the first visitor input', async () => {
    showCardShape(card());
    await settle();
    expect(runtime.created).toBe(0);

    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));
    expect(runtime.add).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'shape' })
    );
  });

  test('cards added later join the same runtime', async () => {
    showCardShape(card());
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));

    showCardShape(card());
    expect(runtime.created).toBe(1);
    expect(runtime.add).toHaveBeenCalledTimes(2);
  });

  test('releasing the last card disposes of the runtime', async () => {
    const releaseA = showCardShape(card());
    const releaseB = showCardShape(card());
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));

    releaseA();
    expect(runtime.dispose).not.toHaveBeenCalled();
    releaseB();
    expect(runtime.dispose).toHaveBeenCalledOnce();
  });

  test('leaving before the first input never loads the runtime', async () => {
    const release = showCardShape(card());
    release();
    window.dispatchEvent(new Event('scroll'));
    await settle();
    expect(runtime.created).toBe(0);
  });

  test('holds the shapes still without a hardware GPU', async () => {
    stubWebGLRenderer('Google SwiftShader');
    showCardShape(card());
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));
    expect(runtime.options).toEqual([{ still: true }]);
  });

  test('animates with a hardware GPU', async () => {
    stubWebGLRenderer('ANGLE (NVIDIA GeForce RTX 4060)');
    showCardShape(card());
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));
    expect(runtime.options).toEqual([{ still: false }]);
  });
});
