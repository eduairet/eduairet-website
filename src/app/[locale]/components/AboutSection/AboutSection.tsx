import sectionStyles from '../HomeSection/HomeSection.module.scss';
import styles from './AboutSection.module.scss';
import { Dictionary } from '@/models';
import {
  PROFILE_PHOTO,
  PROFILE_PHOTO_SRCSET,
  SITE_NAME,
} from '@/utils/constants';

const PHOTO_SIZE = 160;
// Matches the photo's CSS size, which drops to 128px below $breakpoint-md.
const PHOTO_SIZES = '(min-width: 768px) 160px, 128px';

interface IProps {
  id: string;
  about: Dictionary['about'];
}

export default function AboutSection({ id, about }: IProps) {
  return (
    <section id={id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>{about.title}</h2>
      <div className={styles.about}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.photo}
          src={PROFILE_PHOTO}
          srcSet={PROFILE_PHOTO_SRCSET}
          sizes={PHOTO_SIZES}
          alt={SITE_NAME}
          width={PHOTO_SIZE}
          height={PHOTO_SIZE}
          loading='lazy'
          decoding='async'
        />
        <p className={styles.text}>{about.text}</p>
      </div>
    </section>
  );
}
