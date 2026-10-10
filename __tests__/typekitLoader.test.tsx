import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TypekitStylesheet from '@/components/metadata/TypekitStylesheet';
import { TYPEKIT_LOADER, TYPEKIT_URL } from '@/utils/constants';

const kitLinks = () =>
  [...document.head.querySelectorAll('link[rel="stylesheet"]')].filter(
    (link) => link.getAttribute('href') === TYPEKIT_URL
  );

/* eslint-disable no-unused-vars */
type PaintCallback = (
  list: { getEntriesByName: (name: string) => unknown[] },
  observer: { disconnect: () => void }
) => void;
/* eslint-enable no-unused-vars */

afterEach(() => {
  kitLinks().forEach((link) => link.remove());
  vi.unstubAllGlobals();
});

describe('Adobe Fonts loader', () => {
  test('adds the kit stylesheet only after the first contentful paint', () => {
    let notify: PaintCallback = () => {};
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'PerformanceObserver',
      Object.assign(
        class {
          constructor(callback: PaintCallback) {
            notify = callback;
          }
          observe = observe;
        },
        { supportedEntryTypes: ['paint'] }
      )
    );
    new Function(TYPEKIT_LOADER)();
    expect(observe).toHaveBeenCalledWith({ type: 'paint', buffered: true });
    expect(kitLinks()).toHaveLength(0);

    notify({ getEntriesByName: () => [] }, { disconnect });
    expect(kitLinks()).toHaveLength(0);

    notify({ getEntriesByName: () => [{}] }, { disconnect });
    expect(kitLinks()).toHaveLength(1);
    expect(disconnect).toHaveBeenCalled();
  });

  test('falls back to the load event without paint timing', () => {
    vi.stubGlobal('PerformanceObserver', undefined);
    new Function(TYPEKIT_LOADER)();
    expect(kitLinks()).toHaveLength(0);

    window.dispatchEvent(new Event('load'));
    expect(kitLinks()).toHaveLength(1);
  });

  test('renders no preload, so nothing fetches the kit before the paint', () => {
    const html = renderToStaticMarkup(<TypekitStylesheet />);
    expect(html).not.toContain('preload');
    expect(html).toContain('<noscript>');
  });
});
