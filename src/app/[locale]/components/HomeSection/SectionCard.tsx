'use client';

import { useContext, useEffect, useRef } from 'react';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import { LanguageContext } from '@/store/LanguageProvider';
import TechIcon from './TechIcon';
import ExternalLink from '@/components/ui/ExternalLink/ExternalLink';
import { showCardShape } from '@/components/art/CardShapes/cardShapes';
import {
  REVEAL_CLASS,
  useReveal,
} from '@/components/wrappers/RevealOnScroll/useReveal';

interface IProps {
  entry: SectionEntry;
  icons: string[];
  tools: string[];
}

export default function SectionCard({ entry, icons, tools }: IProps) {
  const { content } = useContext(LanguageContext);
  const cardRef = useRef<HTMLLIElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useReveal(cardRef);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    return showCardShape({
      card,
      content: contentRef.current,
      className: styles.shape,
    });
  }, []);

  return (
    <li ref={cardRef} className={`${styles.card} ${REVEAL_CLASS}`}>
      <div ref={contentRef} className={styles.content}>
        <p className={styles.period}>{entry.period}</p>
        <h3 className={styles.roleTitle}>
          {entry.roleUrl ? (
            <ExternalLink href={entry.roleUrl} newTab={content.home.newTab}>
              {entry.role}
            </ExternalLink>
          ) : (
            entry.role
          )}
        </h3>
        {(entry.company || entry.meta) && (
          <p className={styles.company}>
            {entry.companyUrl ? (
              <ExternalLink
                href={entry.companyUrl}
                newTab={content.home.newTab}
              >
                {entry.company}
              </ExternalLink>
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
        {icons.length + tools.length > 0 && (
          <ul className={styles.stack} aria-label={content.home.techStack}>
            {icons.map((tool) => (
              <li key={tool}>
                <TechIcon tool={tool} />
              </li>
            ))}
            {tools.map((tool) => (
              <li key={tool} className={styles.toolPill}>
                {tool}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
