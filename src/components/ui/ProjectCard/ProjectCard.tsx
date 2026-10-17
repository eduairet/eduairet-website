'use client';

import { useRef, type CSSProperties } from 'react';
import cardStyles from '@/app/[locale]/components/HomeSection/HomeSection.module.scss';
import styles from './ProjectCard.module.scss';
import TechStackList from '@/app/[locale]/components/HomeSection/TechStackList';
import IntentLink from '@/components/ui/IntentLink/IntentLink';
import { useCardShape } from '@/components/art/CardShapes/useCardShape';
import type { ProjectCardData } from './projectCards';

interface IProps {
  card: ProjectCardData;
  techStack: string;
  heading?: 'h2' | 'h3';
  id?: string;
  className?: string;
  style?: CSSProperties;
}

// The title link stretches over the card, so the card is one link and no anchors nest.
export default function ProjectCard({
  card,
  techStack,
  heading: Heading = 'h3',
  id,
  className = '',
  style,
}: IProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useCardShape(cardRef, contentRef, cardStyles.shape);

  return (
    <li
      ref={cardRef}
      id={id}
      className={`${cardStyles.card} ${styles.card} ${className}`}
      style={style}
    >
      <div
        ref={contentRef}
        className={`${cardStyles.content} ${styles.content}`}
      >
        <p className={cardStyles.period}>{card.period}</p>
        <Heading className={`${cardStyles.roleTitle} ${styles.title}`}>
          <IntentLink href={card.href} className={styles.link}>
            {card.title}
          </IntentLink>
        </Heading>
        {card.company && <p className={cardStyles.company}>{card.company}</p>}
        <p className={cardStyles.description}>{card.summary}</p>
        <TechStackList
          icons={card.icons}
          tools={card.tools}
          label={techStack}
          className={styles.stack}
        />
      </div>
    </li>
  );
}
