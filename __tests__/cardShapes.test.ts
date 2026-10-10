import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const runtime = vi.hoisted(() => ({
  created: 0,
  add: vi.fn(),
  remove: vi.fn(),
  dispose: vi.fn(),
}));

vi.mock('@/components/art/CardShapes/shapeRuntime', () => ({
  createShapeRuntime: () => {
    runtime.created++;
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
  runtime.add.mockClear();
  runtime.remove.mockClear();
  runtime.dispose.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

const settle = () => vi.advanceTimersByTimeAsync(2000);

describe('card shapes registry', () => {
  test('loads nothing before the first visitor input', async () => {
    showCardShape(document.createElement('li'), 'shape');
    await settle();
    expect(runtime.created).toBe(0);

    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));
    expect(runtime.add).toHaveBeenCalledWith(
      expect.any(HTMLLIElement),
      'shape'
    );
  });

  test('cards added later join the same runtime', async () => {
    showCardShape(document.createElement('li'), 'shape');
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));

    showCardShape(document.createElement('li'), 'shape');
    expect(runtime.created).toBe(1);
    expect(runtime.add).toHaveBeenCalledTimes(2);
  });

  test('releasing the last card disposes of the runtime', async () => {
    const releaseA = showCardShape(document.createElement('li'), 'shape');
    const releaseB = showCardShape(document.createElement('li'), 'shape');
    window.dispatchEvent(new Event('scroll'));
    await settle();
    await vi.waitFor(() => expect(runtime.created).toBe(1));

    releaseA();
    expect(runtime.dispose).not.toHaveBeenCalled();
    releaseB();
    expect(runtime.dispose).toHaveBeenCalledOnce();
  });

  test('leaving before the first input never loads the runtime', async () => {
    const release = showCardShape(document.createElement('li'), 'shape');
    release();
    window.dispatchEvent(new Event('scroll'));
    await settle();
    expect(runtime.created).toBe(0);
  });
});
