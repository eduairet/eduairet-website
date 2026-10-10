import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// The gate keeps module state (visitor seen, renderer probed).
let gate: typeof import('@/components/art/startGate');

beforeEach(async () => {
  vi.resetModules();
  gate = await import('@/components/art/startGate');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('start gate', () => {
  test('waits for the first input, then runs later callers at once', () => {
    const first = vi.fn();
    gate.whenVisitorActive(first);
    expect(first).not.toHaveBeenCalled();

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    expect(first).toHaveBeenCalledOnce();

    const later = vi.fn();
    gate.whenVisitorActive(later);
    expect(later).toHaveBeenCalledOnce();
  });

  test('a cancelled wait never runs', () => {
    const callback = vi.fn();
    gate.whenVisitorActive(callback)();
    window.dispatchEvent(new Event('keydown'));
    expect(callback).not.toHaveBeenCalled();
  });

  test('without requestIdleCallback it waits for a timer, and can be cancelled', () => {
    vi.useFakeTimers();
    const ran = vi.fn();
    const skipped = vi.fn();
    gate.whenIdle(ran);
    gate.whenIdle(skipped)();
    vi.advanceTimersByTime(500);
    expect(ran).toHaveBeenCalledOnce();
    expect(skipped).not.toHaveBeenCalled();
  });

  test('probes the renderer once and treats SwiftShader as software', () => {
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation((() => ({
        RENDERER: 1,
        getParameter: () => 'Google SwiftShader',
        getExtension: () => null,
      })) as unknown as HTMLCanvasElement['getContext']);

    expect(gate.hasHardwareWebGL()).toBe(false);
    expect(gate.hasHardwareWebGL()).toBe(false);
    expect(getContext).toHaveBeenCalledOnce();
  });
});
