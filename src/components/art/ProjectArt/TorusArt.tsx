'use client';

import { useCallback, useRef, type CSSProperties } from 'react';
import styles from './ProjectArt.module.scss';
import { renderTorus, TORUS_COLS, TORUS_STEP } from './torus';
import { useOnScreenMotion } from '@/hooks/useOnScreenMotion';

const FRAME_MS = 33;
// A pose that reads as a torus in the still frame.
const START = { a: 1.1, b: 0.75 };
const STILL_FRAME = renderTorus(START.a, START.b);

interface IProps {
  caption: string;
}

export default function TorusArt({ caption }: IProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const pose = useRef({ ...START });

  const start = useCallback(() => {
    let timer = 0;
    const step = () => {
      pose.current.a += TORUS_STEP.a;
      pose.current.b += TORUS_STEP.b;
      if (preRef.current)
        preRef.current.textContent = renderTorus(
          pose.current.a,
          pose.current.b
        );
      timer = window.setTimeout(step, FRAME_MS);
    };
    step();
    return () => window.clearTimeout(timer);
  }, []);

  useOnScreenMotion(preRef, start);

  return (
    <figure className={`${styles.frame} ${styles.terminal}`}>
      <pre
        ref={preRef}
        className={styles.screen}
        style={{ '--columns': TORUS_COLS } as CSSProperties}
        aria-hidden='true'
      >
        {STILL_FRAME}
      </pre>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
