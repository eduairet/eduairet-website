'use client';

import { useEffect, useRef, useState } from 'react';
import { cubicBezier, lerp } from '@/utils';

// framer-motion's default tween for non-transform values.
const DURATION_MS = 300;
const ease = cubicBezier(0.25, 0.1, 0.35, 1);

const NUMBER = /-?\d*\.?\d+/g;
const numbersIn = (d: string) => (d.match(NUMBER) ?? []).map(Number);
const round = (n?: number) =>
  n === undefined ? undefined : Math.round(n * 1e5) / 1e5;

// Morphs an SVG path to `d` from wherever it is now. Paths must share the
// same commands, so only their numbers change.
export default function usePathTween(d: string) {
  const ref = useRef<SVGPathElement>(null);
  // React renders the first path only, so it never overwrites a frame.
  const [initialD] = useState(d);
  const current = useRef(numbersIn(d));

  useEffect(() => {
    const path = ref.current;
    const from = current.current;
    const to = numbersIn(d);
    if (!path || from.every((n, i) => n === to[i])) return;
    const commands = d.split(NUMBER);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = ease(Math.min((now - start) / DURATION_MS, 1));
      current.current = from.map((n, i) => lerp(n, to[i], progress));
      path.setAttribute(
        'd',
        commands.reduce(
          (out, command, i) =>
            out + command + (round(current.current[i]) ?? ''),
          ''
        )
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [d]);

  return { ref, d: initialD };
}
