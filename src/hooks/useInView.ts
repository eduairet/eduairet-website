'use client';

import { RefObject, useEffect, useState } from 'react';

// True while the element intersects the viewport; checked each time
// `amount` of it crosses the edge.
export default function useInView(
  ref: RefObject<Element | null>,
  amount: number
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: amount }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, amount]);

  return inView;
}
