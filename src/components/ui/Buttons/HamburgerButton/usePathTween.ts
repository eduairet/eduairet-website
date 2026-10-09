'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { cubicBezier, lerp } from '@/utils';

// Same timing as the middle line's CSS transition.
const DURATION_MS = 300;
const ease = cubicBezier(0.25, 0.1, 0.35, 1);

const NUMBER = /-?\d*\.?\d+/g;
const numbersIn = (d: string) => (d.match(NUMBER) ?? []).map(Number);
const round = (n: number) => Math.round(n * 1e5) / 1e5;

// Morphs an SVG path to `d` from wherever it is now, and returns the `d`
// to render. Paths must share the same commands, so only their numbers change.
export default function usePathTween(
  ref: RefObject<SVGPathElement | null>,
  d: string
) {
  // React renders the first path only, so it never overwrites a frame.
  const [initialD] = useState(d);
  const current = useRef(numbersIn(d));

  useEffect(() => {
    const path = ref.current;
    const from = current.current;
    const to = numbersIn(d);
    if (!path || from.every((n, i) => n === to[i])) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = ease(Math.min((now - start) / DURATION_MS, 1));
      current.current = from.map((n, i) => lerp(n, to[i], progress));
      let i = 0;
      path.setAttribute(
        'd',
        d.replace(NUMBER, () => String(round(current.current[i++])))
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ref, d]);

  return initialD;
}
