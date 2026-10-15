import {
  afterEach,
  beforeEach,
  expect,
  test,
  vi,
  type MockInstance,
} from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';

import AboutVideo from '@/app/[locale]/components/AboutSection/AboutVideo';

// eslint-disable-next-line no-unused-vars
let setOnScreen: (isIntersecting: boolean) => void = () => {};
let reducedMotion = false;
let play: MockInstance<HTMLMediaElement['play']>;
let pause: MockInstance<HTMLMediaElement['pause']>;

beforeEach(() => {
  reducedMotion = false;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        // eslint-disable-next-line no-unused-vars
        callback: (entries: { isIntersecting: boolean }[]) => void
      ) {
        setOnScreen = (isIntersecting) => callback([{ isIntersecting }]);
      }
      observe() {}
      disconnect() {}
    }
  );
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reducedMotion;
    },
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal('requestIdleCallback', (callback: () => void) => {
    callback();
    return 1;
  });
  vi.stubGlobal('cancelIdleCallback', () => {});
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  pause = vi
    .spyOn(HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('a lazy still sits under a muted, looping video that loads on demand', () => {
  render(<AboutVideo />);
  const portrait = screen.getByRole('img', { name: 'Eduardo Aire Torres' });
  const still = portrait.querySelector('img')!;
  const video = portrait.querySelector('video')!;

  expect(still.getAttribute('src')).toBe('/eduardo-aire-torres.webp');
  expect(still.getAttribute('alt')).toBe('');
  expect(still.getAttribute('loading')).toBe('lazy');
  expect(video.getAttribute('aria-hidden')).toBe('true');
  expect(video.hasAttribute('poster')).toBe(false);
  expect(video.hasAttribute('autoplay')).toBe(false);
  expect(video.getAttribute('preload')).toBe('none');
  expect(video.muted).toBe(true);
  expect(video.loop).toBe(true);
  expect(video.hasAttribute('playsinline')).toBe(true);
  expect(video.querySelector('source')?.getAttribute('src')).toBe(
    '/eduardo-aire-torres.mp4'
  );
});

test('shows the still until the visitor scrolls, then loops while on screen', () => {
  render(<AboutVideo />);
  act(() => setOnScreen(true));
  expect(play).not.toHaveBeenCalled();

  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
  expect(play).toHaveBeenCalledOnce();

  act(() => setOnScreen(false));
  expect(pause).toHaveBeenCalled();
});

test('never plays when motion is reduced', () => {
  reducedMotion = true;
  render(<AboutVideo />);
  act(() => {
    window.dispatchEvent(new Event('scroll'));
    setOnScreen(true);
  });
  expect(play).not.toHaveBeenCalled();
});
