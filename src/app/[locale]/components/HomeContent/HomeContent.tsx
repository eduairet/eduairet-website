import styles from './HomeContent.module.scss';
import { Dictionary, type Lang } from '@/models';
import HomeTitle from '@/app/[locale]/components/HomeTitle/HomeTitle';
import HomeSubtitle from '../HomeSubtitle/HomeSubtitle';
import HomeSummary from '../HomeSummary/HomeSummary';
import ScrollCue from '../ScrollCue/ScrollCue';
import AboutSection from '../AboutSection/AboutSection';
import HomeSection from '../HomeSection/HomeSection';
import ProjectsSection from '../ProjectsSection/ProjectsSection';

interface IProps {
  locale: Lang;
  content: Dictionary;
}

export default function HomeContent({ locale, content }: IProps) {
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
      <ProjectsSection id='projects' locale={locale} content={content} />
      <HomeSection id='education' section={content.education} />
    </div>
  );
}
