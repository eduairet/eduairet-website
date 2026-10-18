import { RefObject, useEffect } from 'react';
import styles from './RevealOnScroll.module.scss';

// One shared observer; adding .reveal here keeps blocks visible until scripts run.
export const REVEAL_CLASS = styles.reveal;

let observer: IntersectionObserver | undefined;
const revealObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach(
        ({ target, isIntersecting, boundingClientRect, rootBounds }) => {
          target.classList.add(REVEAL_CLASS);
          // A card leaving through the top stays shown. Dropping it 30px
          // would cross the 0.3 threshold again and the card would shake.
          const above =
            rootBounds != null && boundingClientRect.top < rootBounds.top;
          target.classList.toggle(styles.inView, isIntersecting || above);
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
