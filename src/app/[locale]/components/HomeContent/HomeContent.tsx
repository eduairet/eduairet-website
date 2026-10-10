import styles from './HomeContent.module.scss';
import { Dictionary } from '@/models';
import HomeTitle from '@/app/[locale]/components/HomeTitle/HomeTitle';
import HomeSubtitle from '../HomeSubtitle/HomeSubtitle';
import HomeSummary from '../HomeSummary/HomeSummary';
import ScrollCue from '../ScrollCue/ScrollCue';
import AboutSection from '../AboutSection/AboutSection';
import HomeSection from '../HomeSection/HomeSection';

interface IProps {
  content: Dictionary;
}

export default function HomeContent({ content }: IProps) {
  return (
    <div className={styles.content}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <HomeTitle />
          <HomeSubtitle subtitle={content.home.subtitle} />
          <HomeSummary summary={content.home.summary} />
        </div>
        <ScrollCue label={content.home.scrollCue} target='about' />
      </section>
      <AboutSection id='about' about={content.about} />
      <HomeSection id='experience' section={content.experience} />
      <HomeSection id='projects' section={content.projects} />
      <HomeSection id='education' section={content.education} />
    </div>
  );
}
