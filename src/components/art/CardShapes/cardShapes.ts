import {
  hasHardwareWebGL,
  whenIdle,
  whenVisitorActive,
} from '@/components/art/startGate';
import type { ShapeCard, ShapeRuntime } from './shapeRuntime';

// Loads the drawing code after the first input; stops when no card is left.
const cards = new Map<HTMLElement, ShapeCard>();
let runtime: ShapeRuntime | null = null;
let cancelStart: (() => void) | null = null;

function start() {
  if (cancelStart || runtime) return;
  let cancelled = false;
  let cancelIdle = () => {};
  const cancelWait = whenVisitorActive(() => {
    cancelIdle = whenIdle(() => {
      import('./shapeRuntime')
        .then(({ createShapeRuntime }) => {
          if (cancelled) return;
          cancelStart = null;
          // Without a hardware GPU the canvas draws on the CPU, so hold still.
          runtime = createShapeRuntime({ still: !hasHardwareWebGL() });
          cards.forEach((shape) => runtime?.add(shape));
        })
        // If the chunk fails to load, the cards simply have no shapes.
        .catch(() => {});
    });
  });
  cancelStart = () => {
    cancelled = true;
    cancelWait();
    cancelIdle();
  };
}

function stop() {
  cancelStart?.();
  cancelStart = null;
  runtime?.dispose();
  runtime = null;
}

export function showCardShape(shape: ShapeCard) {
  cards.set(shape.card, shape);
  if (runtime) runtime.add(shape);
  else start();
  return () => {
    cards.delete(shape.card);
    runtime?.remove(shape.card);
    if (!cards.size) stop();
  };
}
