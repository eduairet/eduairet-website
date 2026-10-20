import styles from './project.module.scss';
import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import TechStackList from '@/app/[locale]/components/HomeSection/TechStackList';
import { resolveStack } from '@/app/[locale]/components/HomeSection/techStack';
import ProjectArt from './components/ProjectArt';
import ProjectMedia from './components/ProjectMedia/ProjectMedia';
import JsonLd from '@/components/metadata/JsonLd';
import ArrowIcon from '@/components/ui/ArrowIcon/ArrowIcon';
import ExternalLink from '@/components/ui/ExternalLink/ExternalLink';
import IntentLink from '@/components/ui/IntentLink/IntentLink';
import PageTransition from '@/components/wrappers/PageTransition/PageTransition';
import { nextProject, PageUrls, PROJECTS } from '@/utils/constants';
import {
  buildProjectMetadata,
  buildProjectStructuredData,
  projectOr404,
} from '@/utils/server';
import { fillTemplate, githubHandle } from '@/utils/template.utils';

interface IProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: IProps) {
  const { locale, slug } = await params;
  return buildProjectMetadata(locale, slug);
}

export default async function ProjectPage({ params }: IProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLang(localeParam);
  const project = projectOr404(slug);
  const content = await getDictionary(locale);
  const { projects } = content;
  const copy = projects.items[project.slug];
  const next = nextProject(project.slug);

  return (
    <>
      <JsonLd data={await buildProjectStructuredData(locale, project.slug)} />
      <PageTransition>
        <article className={styles.project}>
          <IntentLink href={PageUrls.projects_(locale)} className={styles.back}>
            <ArrowIcon direction='left' />
            {projects.allProjects}
          </IntentLink>
          <div className={styles.header}>
            <p className={styles.meta}>
              {copy.period} · {copy.role}
            </p>
            <h1 className={styles.title}>{copy.title}</h1>
            {copy.team && (
              <p className={styles.team}>
                {fillTemplate(copy.team, githubHandle(content.home.newTab))}
              </p>
            )}
          </div>
          <div className={styles.explanation}>
            {copy.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {project.links.length > 0 && (
            <ul className={styles.links} aria-label={projects.linksLabel}>
              {project.links.map(({ kind, href }) => (
                <li key={href}>
                  <ExternalLink href={href} newTab={content.home.newTab}>
                    {projects.links[kind]}
                    <ArrowIcon direction='out' />
                  </ExternalLink>
                </li>
              ))}
            </ul>
          )}
          <TechStackList
            {...resolveStack(project.stack)}
            label={content.home.techStack}
            className={styles.stack}
          />
          <section className={styles.section} aria-labelledby='what-i-did'>
            <h2 id='what-i-did'>{projects.whatIDid}</h2>
            <ul className={styles.highlights}>
              {copy.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
          {project.art && (
            <section className={styles.section} aria-labelledby='try-it'>
              <h2 id='try-it'>{projects.tryIt}</h2>
              <ProjectArt art={project.art} copy={projects.art} />
            </section>
          )}
          {project.media.length > 0 && (
            <section className={styles.section} aria-labelledby='media'>
              <h2 id='media'>{projects.media}</h2>
              <ProjectMedia
                slug={project.slug}
                media={project.media}
                alts={copy.media}
                openLarger={projects.openLarger}
                close={projects.close}
              />
            </section>
          )}
          <nav className={styles.next} aria-label={projects.nextProject}>
            <IntentLink href={PageUrls.project_(locale, next.slug)}>
              <span className={styles.nextLabel}>{projects.nextProject}</span>{' '}
              <span className={styles.nextTitle}>
                {projects.items[next.slug].title}
                <ArrowIcon direction='right' />
              </span>
            </IntentLink>
          </nav>
        </article>
      </PageTransition>
    </>
  );
}
