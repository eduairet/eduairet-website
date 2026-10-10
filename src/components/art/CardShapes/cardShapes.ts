import { whenIdle, whenVisitorActive } from '@/components/art/startGate';
import type { ShapeRuntime } from './shapeRuntime';

// Cards register here as they mount. The drawing code loads only after the
// first visitor input and an idle moment, and stops when no card is left.
const cards = new Map<HTMLElement, string>();
let runtime: ShapeRuntime | null = null;
let generation = 0;
let cancelStart: (() => void) | null = null;

function start() {
  if (cancelStart || runtime) return;
  const current = ++generation;
  let cancelIdle = () => {};
  const cancelWait = whenVisitorActive(() => {
    cancelIdle = whenIdle(() => {
      import('./shapeRuntime')
        .then(({ createShapeRuntime }) => {
          if (current !== generation) return;
          cancelStart = null;
          runtime = createShapeRuntime();
          cards.forEach((className, card) => runtime?.add(card, className));
        })
        // If the chunk fails to load, the cards simply have no shapes.
        .catch(() => {});
    });
  });
  cancelStart = () => {
    cancelWait();
    cancelIdle();
  };
}

function stop() {
  generation++;
  cancelStart?.();
  cancelStart = null;
  runtime?.dispose();
  runtime = null;
}

export function showCardShape(card: HTMLElement, className: string) {
  cards.set(card, className);
  if (runtime) runtime.add(card, className);
  else start();
  return () => {
    cards.delete(card);
    runtime?.remove(card);
    if (!cards.size) stop();
  };
}
