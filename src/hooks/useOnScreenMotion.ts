import { RefObject, useEffect } from 'react';
import { REDUCED_MOTION_QUERY } from '@/utils/constants';

export function useOnScreenMotion(
  ref: RefObject<HTMLElement | null>,
  start: () => () => void
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
    let onScreen = false;
    let stop: (() => void) | null = null;
    const update = () => {
      const run = onScreen && !document.hidden && !reducedMotion.matches;
      if (run && !stop) stop = start();
      if (!run && stop) {
        stop();
        stop = null;
      }
    };
    const viewport = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    viewport.observe(element);
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      viewport.disconnect();
      document.removeEventListener('visibilitychange', update);
      reducedMotion.removeEventListener('change', update);
      stop?.();
    };
  }, [ref, start]);
}
