'use client';

import { useEffect, useRef, useState } from 'react';
import cardStyles from '@/components/ui/ProjectCard/ProjectCard.module.scss';
import styles from './ProjectGrid.module.scss';
import ProjectCard from '@/components/ui/ProjectCard/ProjectCard';
import type { ProjectCardData } from '@/components/ui/ProjectCard/projectCards';
import { PROJECT_GRID_LIMIT } from '@/utils/constants';

export const MORE_PROJECTS_ID = 'more-projects';
const STAGGER_MS = 90;

interface IProps {
  cards: ProjectCardData[];
  viewAll: string;
  techStack: string;
}

// Links to the first hidden card, so :target opens the grid without JavaScript.
export default function ProjectGrid({ cards, viewAll, techStack }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector<HTMLAnchorElement>(`#${MORE_PROJECTS_ID} a`)
      ?.focus({ preventScroll: true });
  }, [isOpen]);

  return (
    <>
      <ul
        ref={listRef}
        className={`${cardStyles.grid} ${styles.grid}`}
        data-open={isOpen || undefined}
      >
        {cards.map((card, i) => {
          const extra = i >= PROJECT_GRID_LIMIT;
          return (
            <ProjectCard
              key={card.slug}
              card={card}
              heading='h2'
              techStack={techStack}
              id={i === PROJECT_GRID_LIMIT ? MORE_PROJECTS_ID : undefined}
              className={extra ? styles.extra : ''}
              style={
                extra
                  ? {
                      transitionDelay: `${(i - PROJECT_GRID_LIMIT) * STAGGER_MS}ms`,
                    }
                  : undefined
              }
            />
          );
        })}
      </ul>
      {cards.length > PROJECT_GRID_LIMIT && (
        <a
          href={`#${MORE_PROJECTS_ID}`}
          className={`${cardStyles.pillLink} ${styles.viewAll}`}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          {viewAll}
        </a>
      )}
    </>
  );
}
