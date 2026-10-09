import { Fragment, type ReactNode } from 'react';
import styles from './Credits.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import { FontUrls, SITE_NAME, SocialUrls } from '@/utils/constants';

interface IProps {
  lang: Lang;
}

export default async function Credits({ lang }: IProps) {
  const content = await getDictionary(lang);

  const link = (href: string, label: string) => (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {label}
      <span className='visually-hidden'> {content.home.newTab}</span>
    </a>
  );
  const links: Record<string, ReactNode> = {
    '{name}': link(SocialUrls.github, SITE_NAME),
    '{font}': link(FontUrls.degular, 'Degular'),
    '{foundry}': link(FontUrls.foundry, 'OH no Type Co.'),
  };

  return (
    <p className={styles.credits}>
      {content.footer.credits.split(/(\{\w+\})/).map((part, i) => (
        <Fragment key={i}>{links[part] ?? part}</Fragment>
      ))}
    </p>
  );
}
