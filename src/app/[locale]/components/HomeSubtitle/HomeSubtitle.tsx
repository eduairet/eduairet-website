import { degular } from '@/utils/constants';
import { lerp } from '@/utils';
import styles from './HomeSubtitle.module.scss';

interface IProps {
  subtitle: string;
}

export default function HomeSubtitle({ subtitle }: IProps) {
  const subtitleArray = subtitle.split(' • ');

  return (
    <h2 className={styles.subtitle}>
      {subtitleArray.map((w, i) => {
        return (
          <span
            key={`subtitle-word-${i.toString().padStart(2, '0')}`}
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
        );
      })}
    </h2>
  );
}
