'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './EatHomeButton.module.scss';
import { Lang } from '@/models';
import { PageUrls } from '@/utils/constants';
import SvgWrapper from '@/components/wrappers/SvgWrapper';
import IconButtonScreenTitle from '@/components/ui/Buttons/IconButton/IconButtonScreenTitle';

interface IProps {
  locale: Lang;
}

export default function EatHomeButton({ locale }: IProps) {
  const pathname = usePathname();

  const isActive = pathname === PageUrls.home_(locale);

  return (
    <Link
      className={[styles['eat-home'], isActive ? styles.active : ''].join(' ')}
      href={PageUrls.home_(locale)}
      aria-label='Home'
    >
      <SvgWrapper>
        <path d='M29.7 43.6v9.1h-7.3v-9.1c0-3.3.9-6.6 3.7-6.6s3.6 3.2 3.6 6.6zM100 50c0 27.6-22.4 50-50 50S0 77.6 0 50 22.4 0 50 0s50 22.4 50 50zm-63.3-1.8c0-9-5.3-12.3-10.7-12.3-5.5 0-10.7 3.3-10.7 12.3 0 2.8.7 8.3.7 12.4 0 2-.3 4.1-.7 4.4l11.9 6 8.1-7.5-.1-.1c-.8.8-1.9 1.5-3.5 1.9l-9.4-4.7v-6.9l14.3.3v-5.8zm30.1 16.7-.1-.1c-.2.2-.6.4-1.1.5L61.3 61V48.2c0-9-4.9-12.3-10.3-12.3-6.3 0-10.3 5.3-10.3 10.6 0 2.9 1.4 4.9 4 4.9 2.3 0 4-1.7 4-4 0-2.5-1.3-3.5-1.3-5.7 0-2.6.9-4.7 3.7-4.7 2.2 0 3.7 1.3 3.7 6.6V61c0 2.3-.3 3.6-2.1 3.7l-5.2-3.3V58c0-2.4 2.1-3.9 3.5-4.3v-.1l-11.1 2.9c.3.3 1 2.3 1 4.3 0 1.9-.7 3.9-1 4.3l9 6 6-6 6 6 5.9-6.2zm17.8-1.3-.1-.1c-.5.5-1.3 1.2-3.5 1.3L76.5 62V38.7h6.7v-1.1h-6.7V29c-1.3 1.3-3.7 2-6.7 2v6.7h-4v1.1h4V47c0 9.9-.3 16.1-2.3 18.1l9.7 6 7.4-7.5z' />
      </SvgWrapper>
      <IconButtonScreenTitle title='Home' />
    </Link>
  );
}
