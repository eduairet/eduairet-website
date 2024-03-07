'use client';

import styles from './HomeTitle.module.scss';
import { lerp } from '@/utils';
import { degular } from '@/utils/constants';

const titleArray = 'Eduardo Aire Torres'.split('');

const letterInterpolation = (i: number) =>
  `'wght' ${lerp(
    degular.wght.max,
    degular.wght.min,
    i / titleArray.length
  )} , 'opsz' ${degular.opsz.max}`;

export default function HomeTitle() {
  return (
    <h1 className={styles.title}>
      {titleArray.map((l, i) => {
        return (
          <span
            key={`title-letter-${i.toString().padStart(2, '0')}`}
            style={{
              fontVariationSettings: letterInterpolation(i),
              transition: 'font-variation-settings 0.5s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.fontVariationSettings = letterInterpolation(
                titleArray.length - i
              );
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.fontVariationSettings =
                letterInterpolation(i);
            }}
          >
            {l}
          </span>
        );
      })}
    </h1>
  );
}
