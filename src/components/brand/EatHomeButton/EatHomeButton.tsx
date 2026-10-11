'use client';

import { useContext, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import styles from './EatHomeButton.module.scss';
import { Lang } from '@/models';
import { PageUrls } from '@/utils/constants';
import EatLogo from '@/components/brand/EatLogo';
import IconButtonScreenTitle from '@/components/ui/Buttons/IconButton/IconButtonScreenTitle';
import { LanguageContext } from '@/store/LanguageProvider';
import IntentLink from '@/components/ui/IntentLink/IntentLink';

interface IProps {
  locale: Lang;
  compact?: boolean;
  className?: string;
}

export default function EatHomeButton({
  locale,
  compact = false,
  className,
}: IProps) {
  const pathname = usePathname();
  const { content } = useContext(LanguageContext);

  const isActive = pathname === PageUrls.home_(locale);

  const stayOnCurrentHome = (e: MouseEvent) => {
    if (isActive) e.preventDefault();
  };

  return (
    <IntentLink
      className={[
        styles['eat-home'],
        isActive && styles.active,
        compact && styles.compact,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      href={PageUrls.home_(locale)}
      aria-current={isActive ? 'page' : undefined}
      onClick={stayOnCurrentHome}
    >
      <EatLogo />
      <IconButtonScreenTitle title={content.nav.home} />
    </IntentLink>
  );
}
