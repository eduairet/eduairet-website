'use client';

import Link from 'next/link';
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { usePathname } from 'next/navigation';
import styles from './EatHomeButton.module.scss';
import { Lang } from '@/models';
import { PageUrls, ProfilePhoto } from '@/utils/constants';
import EatLogo from '@/components/brand/EatLogo';
import IconButtonScreenTitle from '@/components/ui/Buttons/IconButton/IconButtonScreenTitle';
import { LanguageContext } from '@/store/LanguageProvider';

const PHOTO_SIZE = 56;
const TOUCH_REVEAL_MS = 1500;

interface IProps {
  locale: Lang;
}

export default function EatHomeButton({ locale }: IProps) {
  const pathname = usePathname();
  const { content } = useContext(LanguageContext);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const isActive = pathname === PageUrls.home_(locale);

  const revealPhotoOnTouch = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    setPhotoRevealed(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(
      () => setPhotoRevealed(false),
      TOUCH_REVEAL_MS
    );
  };

  const stayOnCurrentHome = (e: MouseEvent) => {
    if (isActive) e.preventDefault();
  };

  const className = [
    styles['eat-home'],
    isActive && styles.active,
    photoRevealed && styles.revealed,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      className={className}
      href={PageUrls.home_(locale)}
      aria-current={isActive ? 'page' : undefined}
      onPointerDown={revealPhotoOnTouch}
      onClick={stayOnCurrentHome}
    >
      <EatLogo />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.photo}
        src={ProfilePhoto.small}
        alt=''
        width={PHOTO_SIZE}
        height={PHOTO_SIZE}
        loading='lazy'
        decoding='async'
      />
      <IconButtonScreenTitle title={content.nav.home} />
    </Link>
  );
}
