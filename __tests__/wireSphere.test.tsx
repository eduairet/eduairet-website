import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import WireSphere from '@/app/[locale]/components/AboutSection/WireSphere';
import {
  restingSphere,
  wireSpherePaths,
} from '@/app/[locale]/components/AboutSection/spherePaths';
import { turnSphere } from '@/app/[locale]/components/AboutSection/turnSphere';

const RESTING_SPHERE = restingSphere();

// eslint-disable-next-line no-unused-vars
let setOnScreen: (isIntersecting: boolean) => void = () => {};
// eslint-disable-next-line no-unused-vars
let nextFrame: ((now: number) => void) | undefined;
let reducedMotion = false;
const cancelFrame = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  nextFrame = undefined;
  cancelFrame.mockClear();
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
  vi.stubGlobal('requestAnimationFrame', (callback: () => void) => {
    nextFrame = callback;
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', cancelFrame);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const sphereElements = () => {
  const { container } = render(<WireSphere resting={RESTING_SPHERE} />);
  const svg = container.querySelector('svg')!;
  const [far, near] = [...svg.querySelectorAll('path')];
  return { svg, near, far };
};

test('draws the sphere at rest, near lines over far ones', () => {
  const { svg, near, far } = sphereElements();
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(near.getAttribute('d')).toBe(RESTING_SPHERE.near);
  expect(far.getAttribute('d')).toBe(RESTING_SPHERE.far);
});

test('turns while on screen and stops when it leaves', () => {
  const { svg, near, far } = sphereElements();
  const stop = turnSphere(svg, near, far);
  expect(nextFrame).toBeUndefined();

  setOnScreen(true);
  nextFrame?.(performance.now() + 100);
  expect(near.getAttribute('d')).not.toBe(RESTING_SPHERE.near);

  setOnScreen(false);
  expect(cancelFrame).toHaveBeenCalled();
  stop();
});

test('holds still when motion is reduced', () => {
  reducedMotion = true;
  const { svg, near, far } = sphereElements();
  turnSphere(svg, near, far);
  setOnScreen(true);
  expect(nextFrame).toBeUndefined();
  expect(near.getAttribute('d')).toBe(wireSpherePaths(0.6).near);
});
