'use client';

import { useCallback, useMemo, useRef } from 'react';
import styles from './ProjectArt.module.scss';
import {
  mathRandom,
  seededRandom,
  toWaveLetters,
  WAVES_SIZE,
  wavesPath,
} from './waves';
import { useOnScreenMotion } from '@/hooks/useOnScreenMotion';
import { useSessionValue } from './useSessionValue';

const FRAME_MS = 1000 / 12;

interface IProps {
  label: string;
  caption: string;
}

export default function WavesArt({ label, caption }: IProps) {
  const [letters, setLetters] = useSessionValue('waves-letters', 'EAT');
  const figureRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Seeded so server and client match; also the reduced-motion still.
  const still = useMemo(
    () => wavesPath(letters, seededRandom(letters.length + 1)),
    [letters]
  );

  // Frames go straight to the path, without re-rendering React.
  const start = useCallback(() => {
    const timer = window.setInterval(
      () => pathRef.current?.setAttribute('d', wavesPath(letters, mathRandom)),
      FRAME_MS
    );
    return () => window.clearInterval(timer);
  }, [letters]);

  useOnScreenMotion(figureRef, start);

  return (
    <figure ref={figureRef} className={`${styles.frame} ${styles.waves}`}>
      <label className={styles.field}>
        <span>{label}</span>
        <input
          className={styles.input}
          value={letters}
          maxLength={3}
          autoComplete='off'
          autoCapitalize='characters'
          spellCheck={false}
          onChange={(e) => setLetters(toWaveLetters(e.target.value))}
        />
      </label>
      <svg
        className={styles.wavesArt}
        viewBox={`0 0 ${WAVES_SIZE} ${WAVES_SIZE}`}
        width={WAVES_SIZE}
        height={WAVES_SIZE}
        aria-hidden='true'
        focusable='false'
      >
        <path ref={pathRef} d={still} />
      </svg>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
