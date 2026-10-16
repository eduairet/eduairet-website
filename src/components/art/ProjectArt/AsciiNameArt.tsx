'use client';

import { useMemo, type CSSProperties } from 'react';
import styles from './ProjectArt.module.scss';
import { asciiName, toAsciiName } from './asciiName';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import { useSessionValue } from './useSessionValue';

const MAX_LENGTH = 14;
const PLACEHOLDER = 'EAT';
// The original's terminal colors, one per name.
const COLORS = ['#0ff', '#ff0', '#69f', '#f0f'];

interface IProps {
  label: string;
  random: string;
  caption: string;
}

export default function AsciiNameArt({ label, random, caption }: IProps) {
  const [name, setName] = useSessionValue('ascii-name', PLACEHOLDER);
  const [isRandom, setIsRandom] = useSessionValue('ascii-random', false);

  const shown = name || PLACEHOLDER;
  const { art, columns } = useMemo(
    () => asciiName(shown, isRandom ? Math.random : undefined),
    [shown, isRandom]
  );
  const color =
    COLORS[
      [...shown].reduce((sum, c) => sum + c.charCodeAt(0), 0) % COLORS.length
    ];

  return (
    <figure className={`${styles.frame} ${styles.terminal}`}>
      <div className={styles.controls}>
        <label className={styles.field}>
          <span>{label}</span>
          <input
            className={styles.input}
            value={name}
            maxLength={MAX_LENGTH}
            placeholder={PLACEHOLDER}
            autoComplete='off'
            spellCheck={false}
            onChange={(e) => setName(toAsciiName(e.target.value))}
          />
        </label>
        <div className={styles.check}>
          <Checkbox
            id='ascii-random'
            label={random}
            checked={isRandom}
            onChange={(e) => setIsRandom(e.target.checked)}
          />
        </div>
      </div>
      <pre
        className={styles.screen}
        style={{ '--columns': Math.max(columns, 20), color } as CSSProperties}
        aria-hidden='true'
      >
        {art}
      </pre>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
