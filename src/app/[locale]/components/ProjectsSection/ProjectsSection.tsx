import sectionStyles from '../HomeSection/HomeSection.module.scss';
import cardStyles from '@/components/ui/ProjectCard/ProjectCard.module.scss';
import { Dictionary, type Lang } from '@/models';
import ProjectCard from '@/components/ui/ProjectCard/ProjectCard';
import IntentLink from '@/components/ui/IntentLink/IntentLink';
import { toProjectCard } from '@/components/ui/ProjectCard/projectCards';
import { HOME_PROJECTS, PageUrls, PROJECTS } from '@/utils/constants';

interface IProps {
  id: string;
  locale: Lang;
  content: Dictionary;
}

export default function ProjectsSection({ id, locale, content }: IProps) {
  const cards = PROJECTS.filter(({ slug }) => HOME_PROJECTS.includes(slug)).map(
    (project) => toProjectCard(locale, content.projects, project)
  );

  return (
    <section id={id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>{content.projects.title}</h2>
      <ul className={cardStyles.grid}>
        {cards.map((card) => (
          <ProjectCard
            key={card.slug}
            card={card}
            techStack={content.home.techStack}
          />
        ))}
      </ul>
      <IntentLink
        href={PageUrls.projects_(locale)}
        className={cardStyles.pillLink}
      >
        {content.projects.seeMore}
      </IntentLink>
    </section>
  );
}
