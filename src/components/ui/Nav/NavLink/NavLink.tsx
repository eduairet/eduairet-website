'use client';

import { memo, useContext } from 'react';
import { usePathname } from 'next/navigation';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import IntentLink from '@/components/ui/IntentLink/IntentLink';

interface IProps {
  href: string;
  text: string;
  lang?: string;
  isLangLink?: boolean;
}

function NavLink({ href, text, lang, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const { locale } = useContext(LanguageContext);

  const isActive = () => {
    if (isLangLink) return href.includes(locale);
    return pathname == href;
  };

  // The same page in the other language: swap the /{locale} prefix.
  const hrefState = isLangLink
    ? `${href}${pathname.slice(locale.length + 1)}`
    : href;

  return (
    <li className={styles['nav-link']}>
      <IntentLink
        className={isActive() ? styles.active : ''}
        href={hrefState}
        lang={lang}
        hrefLang={lang}
        aria-current={isActive() ? 'page' : undefined}
      >
        {text}
      </IntentLink>
    </li>
  );
}

export default memo(NavLink);
