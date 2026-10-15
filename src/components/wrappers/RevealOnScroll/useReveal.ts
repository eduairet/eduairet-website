import { RefObject, useEffect } from 'react';
import styles from './RevealOnScroll.module.scss';

// One shared observer; adding .reveal here keeps blocks visible until scripts run.
export const REVEAL_CLASS = styles.reveal;

let observer: IntersectionObserver | undefined;
const revealObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        target.classList.add(REVEAL_CLASS);
        target.classList.toggle(styles.inView, isIntersecting);
      }),
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
