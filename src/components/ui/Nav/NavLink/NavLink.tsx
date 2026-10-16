'use client';

import { memo, useContext, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import IntentLink from '@/components/ui/IntentLink/IntentLink';
import {
  canAnimateLocaleSwitch,
  switchLocaleWithTransition,
} from '@/utils/client/localeSwitch';

interface IProps {
  href: string;
  text: string;
  lang?: string;
  isLangLink?: boolean;
}

function NavLink({ href, text, lang, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useContext(LanguageContext);

  const isActive = () => {
    if (isLangLink) return href.includes(locale);
    return pathname == href;
  };

  // The same page in the other language: swap the /{locale} prefix.
  const hrefState = isLangLink
    ? `${href}${pathname.slice(locale.length + 1)}`
    : href;

  // A plain click cross-fades; new-tab clicks and old browsers keep the link.
  const switchLanguage = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      !canAnimateLocaleSwitch() ||
      isActive() ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    switchLocaleWithTransition(() => router.push(hrefState));
  };

  return (
    <li className={styles['nav-link']}>
      <IntentLink
        className={isActive() ? styles.active : ''}
        href={hrefState}
        lang={lang}
        hrefLang={lang}
        aria-current={isActive() ? 'page' : undefined}
        onClick={isLangLink ? switchLanguage : undefined}
      >
        {text}
      </IntentLink>
    </li>
  );
}

export default memo(NavLink);
