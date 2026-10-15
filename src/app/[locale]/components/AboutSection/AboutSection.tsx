import sectionStyles from '../HomeSection/HomeSection.module.scss';
import styles from './AboutSection.module.scss';
import AboutVideo from './AboutVideo';
import RevealOnScroll from '@/components/wrappers/RevealOnScroll/RevealOnScroll';
import { Dictionary } from '@/models';

interface IProps {
  id: string;
  about: Dictionary['about'];
}

export default function AboutSection({ id, about }: IProps) {
  return (
    <section id={id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>{about.title}</h2>
      <RevealOnScroll className={styles.about}>
        <AboutVideo />
        <p className={styles.text}>{about.text}</p>
      </RevealOnScroll>
    </section>
  );
}
