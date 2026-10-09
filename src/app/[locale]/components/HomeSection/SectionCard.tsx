'use client';

import { useContext, useRef } from 'react';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import { LanguageContext } from '@/store/LanguageProvider';
import useInView from '@/hooks/useInView';
import TechIcon from './TechIcon';
import type { TechIconData } from './techStack';

interface IProps {
  entry: SectionEntry;
  icons: TechIconData[];
}

export default function SectionCard({ entry, icons }: IProps) {
  const { content } = useContext(LanguageContext);
  const cardRef = useRef<HTMLLIElement>(null);
  const inView = useInView(cardRef, 0.3);

  return (
    <li
      ref={cardRef}
      className={inView ? `${styles.card} ${styles.inView}` : styles.card}
    >
      <div className={styles.content}>
        <p className={styles.period}>{entry.period}</p>
        <h3 className={styles.roleTitle}>
          {entry.roleUrl ? (
            <a href={entry.roleUrl} target='_blank' rel='noopener noreferrer'>
              {entry.role}
              <span className='visually-hidden'> {content.home.newTab}</span>
            </a>
          ) : (
            entry.role
          )}
        </h3>
        {(entry.company || entry.meta) && (
          <p className={styles.company}>
            {entry.companyUrl ? (
              <a
                href={entry.companyUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                {entry.company}
                <span className='visually-hidden'> {content.home.newTab}</span>
              </a>
            ) : (
              entry.company
            )}
            {entry.meta && (
              <span className={styles.meta}>
                {entry.company ? ' · ' : ''}
                {entry.meta}
              </span>
            )}
          </p>
        )}
        <p className={styles.description}>{entry.description}</p>
      </div>
      {icons.length > 0 && (
        <ul className={styles.stack} aria-label={content.home.techStack}>
          {icons.map((icon) => (
            <li key={icon.title}>
              <TechIcon icon={icon} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
