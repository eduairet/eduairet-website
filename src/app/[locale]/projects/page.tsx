import styles from './projects.module.scss';
import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import ProjectGrid from './components/ProjectGrid/ProjectGrid';
import PageTransition from '@/components/wrappers/PageTransition/PageTransition';
import { toProjectCard } from '@/components/ui/ProjectCard/projectCards';
import type { LocaleProps } from '@/models';
import { PROJECTS } from '@/utils/constants';
import JsonLd from '@/components/metadata/JsonLd';
import { buildPageMetadata, buildProjectsStructuredData } from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return buildPageMetadata((await params).locale, 'projects');
}

export default async function Projects({ params }: LocaleProps) {
  const locale = toLang((await params).locale);
  const content = await getDictionary(locale);
  const { projects } = content;

  return (
    <>
      <JsonLd data={await buildProjectsStructuredData(locale)} />
      <PageTransition>
        <div className={styles.page}>
          <div className={styles.header}>
            <h1 className={styles.heading}>{projects.heading}</h1>
            <p className={styles.intro}>{projects.intro}</p>
          </div>
          <ProjectGrid
            cards={PROJECTS.map((project) =>
              toProjectCard(locale, projects, project)
            )}
            viewAll={projects.viewAll}
            techStack={content.home.techStack}
          />
        </div>
      </PageTransition>
    </>
  );
}
