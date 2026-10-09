export const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

// Same curve as CSS cubic-bezier(x1, y1, x2, y2); takes time 0-1, returns
// progress 0-1.
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (p1: number, p2: number, t: number) =>
    3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let low = 0;
    let high = 1;
    let t = x;
    for (let i = 0; i < 24; i++) {
      if (at(x1, x2, t) < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return at(y1, y2, t);
  };
}
