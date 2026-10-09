'use client';

import { useContext, useEffect, useRef } from 'react';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import { LanguageContext } from '@/store/LanguageProvider';
import TechIcon from './TechIcon';
import type { TechIconData } from './techStack';

// One observer for every card. It toggles the class itself, so scrolling
// never re-renders a card; a card shows while 30% of it crosses into view.
let observer: IntersectionObserver | undefined;
const cardObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) =>
        entry.target.classList.toggle(styles.inView, entry.isIntersecting)
      ),
    { threshold: 0.3 }
  ));

interface IProps {
  entry: SectionEntry;
  icons: TechIconData[];
}

export default function SectionCard({ entry, icons }: IProps) {
  const { content } = useContext(LanguageContext);
  const cardRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    cardObserver().observe(card);
    return () => cardObserver().unobserve(card);
  }, []);

  return (
    <li ref={cardRef} className={styles.card}>
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
