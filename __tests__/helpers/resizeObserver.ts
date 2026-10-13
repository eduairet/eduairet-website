import { vi } from 'vitest';

// jsdom has no ResizeObserver.
export function stubResizeObserver() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
}
