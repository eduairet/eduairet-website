import sectionStyles from '../HomeSection/HomeSection.module.scss';
import styles from './AboutSection.module.scss';
import WireSphere from './WireSphere';
import { restingSphere } from './spherePaths';
import RevealOnScroll from '@/components/wrappers/RevealOnScroll/RevealOnScroll';
import { Dictionary } from '@/models';
import {
  Breakpoints,
  PROFILE_PHOTO,
  PROFILE_PHOTO_SRCSET,
  SITE_NAME,
} from '@/utils/constants';

const PORTRAIT_SIZE = 320;
const RESTING_SPHERE = restingSphere();
// Mirrors .portrait's CSS width.
const PORTRAIT_SIZES = `(min-width: ${Breakpoints.md}px) ${PORTRAIT_SIZE}px, 240px`;

interface IProps {
  id: string;
  about: Dictionary['about'];
}

export default function AboutSection({ id, about }: IProps) {
  return (
    <section id={id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>{about.title}</h2>
      <RevealOnScroll className={styles.about}>
        <div className={styles.portrait}>
          <WireSphere resting={RESTING_SPHERE} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.photo}
            src={PROFILE_PHOTO}
            srcSet={PROFILE_PHOTO_SRCSET}
            sizes={PORTRAIT_SIZES}
            alt={SITE_NAME}
            width={PORTRAIT_SIZE}
            height={PORTRAIT_SIZE}
            loading='lazy'
            decoding='async'
          />
        </div>
        <p className={styles.text}>{about.text}</p>
      </RevealOnScroll>
    </section>
  );
}
