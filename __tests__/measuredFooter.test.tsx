import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';

import MeasuredFooter from '@/components/ui/Footer/MeasuredFooter';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('shares the footer height on <html> and removes it on unmount', () => {
  // eslint-disable-next-line no-unused-vars
  let resize: (blockSize: number) => void = () => {};
  let observed: Element | undefined;
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(
        callback: (
          // eslint-disable-next-line no-unused-vars
          entries: { borderBoxSize: { blockSize: number }[] }[]
        ) => void
      ) {
        resize = (blockSize) => callback([{ borderBoxSize: [{ blockSize }] }]);
      }
      observe(target: Element) {
        observed = target;
      }
      disconnect = disconnect;
    }
  );
  const root = document.documentElement;

  const { container, unmount } = render(
    <MeasuredFooter className='footer'>Links</MeasuredFooter>
  );
  const footer = container.querySelector('footer');
  expect(footer?.className).toBe('footer');
  expect(observed).toBe(footer);
  expect(root.style.getPropertyValue('--footer-height')).toBe('');

  act(() => resize(243.5));
  expect(root.style.getPropertyValue('--footer-height')).toBe('243.5px');

  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(root.style.getPropertyValue('--footer-height')).toBe('');
});
