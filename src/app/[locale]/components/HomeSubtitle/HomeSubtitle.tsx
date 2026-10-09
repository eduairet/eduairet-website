import { Fragment } from 'react';
import { degular } from '@/utils/constants';
import { lerp } from '@/utils';
import styles from './HomeSubtitle.module.scss';

interface IProps {
  subtitle: string;
}

export default function HomeSubtitle({ subtitle }: IProps) {
  const subtitleArray = subtitle.split(' ');

  return (
    <h2 className={styles.subtitle}>
      {subtitleArray.map((w, i) => {
        // Real spaces keep the words apart for screen readers, copy and paste,
        // and search engines.
        return (
          <Fragment key={`subtitle-word-${i.toString().padStart(2, '0')}`}>
            {i > 0 && ' '}
            <span
              className={styles.area}
              style={{
                fontVariationSettings: `'wght' ${lerp(
                  degular.wght.max - 100,
                  degular.wght.min,
                  i / subtitleArray.length
                )} , 'opsz' 36`,
              }}
            >
              {w}
            </span>
          </Fragment>
        );
      })}
    </h2>
  );
}
