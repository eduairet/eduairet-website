import { RefObject, useEffect } from 'react';
import styles from './RevealOnScroll.module.scss';

export const REVEAL_CLASS = styles.reveal;

let observer: IntersectionObserver | undefined;
const revealObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach(
        ({ target, isIntersecting, boundingClientRect, rootBounds }) => {
          target.classList.add(REVEAL_CLASS);
          const leftThroughTop =
            rootBounds != null && boundingClientRect.top < rootBounds.top;
          target.classList.toggle(
            styles.inView,
            isIntersecting || leftThroughTop
          );
        }
      ),
    { threshold: 0.3 }
  ));

export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const block = ref.current;
    if (!block) return;
    revealObserver().observe(block);
    return () => revealObserver().unobserve(block);
  }, [ref]);
}
