import { START_TURN, wireSpherePaths } from './spherePaths';
import { TAU } from '@/utils/math.utils';
import { REDUCED_MOTION_QUERY } from '@/utils/constants';

const TURN_SECONDS = 48;
const STEP_MS = 1000 / 30;
const MAX_STEP_SECONDS = 0.1;

export function turnSphere(
  svg: SVGSVGElement,
  near: SVGPathElement,
  far: SVGPathElement
) {
  const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
  let turn = START_TURN;
  let onScreen = false;
  let frame = 0;
  let lastStep = 0;

  const step = (now: number) => {
    frame = requestAnimationFrame(step);
    // Called at the display rate; step at 30 fps.
    if (now - lastStep < STEP_MS - 1) return;
    const seconds = Math.min((now - lastStep) / 1000, MAX_STEP_SECONDS);
    lastStep = now;
    turn += (TAU / TURN_SECONDS) * seconds;
    const paths = wireSpherePaths(turn);
    near.setAttribute('d', paths.near);
    far.setAttribute('d', paths.far);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    if (!onScreen || reducedMotion.matches) return;
    lastStep = performance.now();
    frame = requestAnimationFrame(step);
  };

  const viewport = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  viewport.observe(svg);
  reducedMotion.addEventListener('change', update);
  return () => {
    viewport.disconnect();
    reducedMotion.removeEventListener('change', update);
    cancelAnimationFrame(frame);
  };
}
