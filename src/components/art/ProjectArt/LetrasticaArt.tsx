'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import styles from './LetrasticaArt.module.scss';
import artStyles from './ProjectArt.module.scss';
import letters from './letrastica-letters.json';
import { useOnScreenMotion } from '@/hooks/useOnScreenMotion';
import { REDUCED_MOTION_QUERY } from '@/utils/constants';

// Letrástica 5, recreated from the event's proof of concept (React + SVG).

type Letter = (typeof letters)[number];

interface Field {
  width: number;
  height: number;
  radius: number;
  white: { dots: number[][]; paths: string[] };
  black: { dots: number[][]; paths: string[] };
}

const LETTER_SCALE = 0.15;
// How far a pupil may travel, as a share of the room left in its eye.
const PUPIL_RANGE = 0.7;
const FIELD_GROUPS = 8;
const JITTER = 5;
const BLINK_SECONDS = 3;
// Where the proof of concept's tablet layout starts; matches the module styles.
const WIDE = 640;

const TOP = letters.slice(0, 5);
const BOTTOM = letters.slice(5, 10);
const FIVE = letters[10];

function LetterShape({ letter, index }: { letter: Letter; index: number }) {
  const id = `l5-${letter.id}`;
  const { open, closed, pupil } = letter.eye;
  return (
    <div
      className={styles.letter}
      style={{ '--delay': `${-((index * 0.37) % 1)}s` } as CSSProperties}
    >
      <svg
        data-letter={letter.id}
        width={letter.width * LETTER_SCALE}
        height={letter.height * LETTER_SCALE}
        viewBox={`0 0 ${letter.width} ${letter.height}`}
        aria-hidden='true'
        focusable='false'
      >
        {letter.shapes.map((shape, i) =>
          'd' in shape ? (
            <path key={i} fill={shape.fill} d={shape.d} />
          ) : (
            <polygon key={i} fill={shape.fill} points={shape.points} />
          )
        )}
        {letter.marks.map((d, i) => (
          <path key={`m${i}`} fill={letter.marksFill} d={d} />
        ))}
        <clipPath id={`${id}-sclera`}>
          <path d={open} />
        </clipPath>
        <clipPath id={`${id}-pupil`}>
          <path data-pupil d={pupil} />
        </clipPath>
        <path id={`${id}-eye`} d={open}>
          <animate
            attributeName='d'
            begin={`${(index * 0.73) % BLINK_SECONDS}s`}
            dur={`${BLINK_SECONDS}s`}
            values={`${closed};${open};${open};${open};${closed}`}
            keyTimes='0;0.05;0.5;0.95;1'
            keySplines={Array(4).fill('0.1 0.9 0.1 1').join(';')}
            calcMode='spline'
            repeatCount='indefinite'
          />
        </path>
        <use clipPath={`url(#${id}-sclera)`} href={`#${id}-eye`} fill='#fff' />
        <use clipPath={`url(#${id}-pupil)`} href={`#${id}-eye`} fill='#000' />
      </svg>
    </div>
  );
}

function FieldMarks({ field }: { field: Field }) {
  const groups = Array.from({ length: FIELD_GROUPS }, (_, g) => g);
  const pick = <T,>(items: T[], g: number) =>
    items.filter((_, i) => i % FIELD_GROUPS === g);
  return (
    <svg
      className={styles.field}
      width={field.width}
      height={field.height}
      viewBox={`0 0 ${field.width} ${field.height}`}
      aria-hidden='true'
      focusable='false'
    >
      {groups.map((g) => (
        <g key={g} data-jitter>
          {(['white', 'black'] as const).map((tone) => (
            <g key={tone} fill={tone === 'white' ? '#fff' : '#000'}>
              {pick(field[tone].dots, g).map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={field.radius} />
              ))}
              {pick(field[tone].paths, g).map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

interface IProps {
  caption: string;
}

export default function LetrasticaArt({ caption }: IProps) {
  const artRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState<boolean | null>(null);
  const [field, setField] = useState<Field | null>(null);

  // Only the figures for the frame's width load: they are decoration.
  useEffect(() => {
    const art = artRef.current;
    if (!art) return;
    const sizes = new ResizeObserver(([entry]) =>
      setWide(entry.contentRect.width > WIDE)
    );
    sizes.observe(art);
    return () => sizes.disconnect();
  }, []);

  useEffect(() => {
    if (wide === null) return;
    let cancelled = false;
    (wide
      ? import('./letrastica-field-medium.json')
      : import('./letrastica-field-small.json')
    ).then((module) => {
      if (!cancelled) setField(module.default);
    });
    return () => {
      cancelled = true;
    };
  }, [wide]);

  // Blinks are SMIL, so they stop by hand under reduced motion.
  useEffect(() => {
    const svgs =
      artRef.current?.querySelectorAll<SVGSVGElement>('svg[data-letter]');
    const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
    const blink = () =>
      svgs?.forEach((svg) =>
        reducedMotion.matches ? svg.pauseAnimations() : svg.unpauseAnimations()
      );
    blink();
    reducedMotion.addEventListener('change', blink);
    return () => reducedMotion.removeEventListener('change', blink);
  }, []);

  // Restarts when the figures load, so they move too.
  const animate = useCallback(() => {
    const art = artRef.current!;
    const eyes = [
      ...art.querySelectorAll<SVGSVGElement>('svg[data-letter]'),
    ].map((svg) => {
      const pupil = svg.querySelector<SVGPathElement>('[data-pupil]')!;
      const sclera = svg.querySelector<SVGPathElement>('clipPath path')!;
      const room =
        (sclera.getBBox().width - pupil.getBBox().width) * PUPIL_RANGE;
      return { pupil, room };
    });
    let frame = 0;
    let pointer = { x: 0, y: 0 };
    const draw = () => {
      frame = 0;
      for (const { pupil, room } of eyes)
        pupil.style.transform = `translate(${pointer.x * 2 * room}px, ${pointer.y * 2 * room}px)`;
    };
    const follow = (e: PointerEvent) => {
      pointer = {
        x: e.clientX / innerWidth - 0.5,
        y: e.clientY / innerHeight - 0.5,
      };
      frame ||= requestAnimationFrame(draw);
    };
    addEventListener('pointermove', follow, { passive: true });
    addEventListener('pointerdown', follow, { passive: true });

    const timers: number[] = [];
    const random = (max: number) => Math.round((Math.random() * 2 - 1) * max);
    art.querySelectorAll<SVGGElement>('[data-jitter]').forEach((group, i) => {
      const move = () => {
        group.style.transform = `translate(${random(JITTER)}px, ${random(JITTER)}px)`;
        timers[i] = window.setTimeout(move, 250 + Math.random() * 250);
      };
      move();
    });

    return () => {
      removeEventListener('pointermove', follow);
      removeEventListener('pointerdown', follow);
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  useOnScreenMotion(artRef, animate);

  return (
    <figure className={`${artStyles.frame} ${styles.frame}`}>
      <div ref={artRef} className={styles.art}>
        {field && <FieldMarks field={field} />}
        <div className={styles.logo}>
          <div className={`${styles.group} ${styles.top}`}>
            {TOP.map((letter, i) => (
              <LetterShape key={letter.id} letter={letter} index={i} />
            ))}
          </div>
          <div className={`${styles.group} ${styles.bottom}`}>
            {BOTTOM.map((letter, i) => (
              <LetterShape key={letter.id} letter={letter} index={i + 5} />
            ))}
          </div>
          <LetterShape letter={FIVE} index={10} />
        </div>
      </div>
      <figcaption className={artStyles.caption}>{caption}</figcaption>
    </figure>
  );
}
