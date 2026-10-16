'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from './ProjectMedia.module.scss';
import {
  projectFile,
  type MediaFrame,
  type ProjectImage,
  type ProjectMedia as Media,
  type ProjectSlug,
  type ProjectVideo,
} from '@/utils/constants';
import { useOnScreenMotion } from '@/hooks/useOnScreenMotion';

interface IProps {
  slug: ProjectSlug;
  media: Media[];
  alts: Record<string, string>;
  openLarger: string;
  close: string;
}

// A browser window or a phone, drawn with the site's lines around the real shot.
function Frame({
  frame,
  children,
}: {
  frame: MediaFrame;
  children: ReactNode;
}) {
  if (frame === 'plain') return <div className={styles.plain}>{children}</div>;
  return (
    <div className={styles[frame]}>
      {frame === 'browser' && (
        <div className={styles.bar} aria-hidden='true'>
          <span />
          <span />
          <span />
        </div>
      )}
      <div className={styles.screen}>{children}</div>
    </div>
  );
}

function Clip({
  src,
  poster,
  video,
  label,
}: {
  src: string;
  poster: string;
  video: ProjectVideo;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = useCallback(() => {
    const element = ref.current!;
    element.play().catch(() => {});
    return () => element.pause();
  }, []);

  useOnScreenMotion(ref, play);

  return (
    <video
      ref={ref}
      className={styles.video}
      width={video.width}
      height={video.height}
      poster={poster}
      aria-label={label}
      preload='none'
      muted
      loop
      playsInline
    >
      <source src={src} type='video/mp4' />
    </video>
  );
}

const sizes = (frame: MediaFrame) =>
  frame === 'phone'
    ? '(min-width: 900px) 240px, 60vw'
    : '(min-width: 900px) 410px, 100vw';

export default function ProjectMedia({
  slug,
  media,
  alts,
  openLarger,
  close,
}: IProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [large, setLarge] = useState<ProjectImage | null>(null);
  const file = (name: string) => projectFile(slug, name);
  const largest = (image: ProjectImage) =>
    file(`${image.name}-${image.widths[0]}.webp`);

  useEffect(() => {
    if (large) dialogRef.current?.showModal();
  }, [large]);

  const open = (e: MouseEvent<HTMLAnchorElement>, image: ProjectImage) => {
    e.preventDefault();
    openerRef.current = e.currentTarget;
    setLarge(image);
  };

  const render = (item: Media) => {
    const alt = alts[item.name] ?? '';
    if (item.kind === 'video') {
      const src = file(`${item.name}.mp4`);
      const poster = file(`${item.name}-poster.webp`);
      return item.demo ? (
        <video
          className={styles.video}
          width={item.width}
          height={item.height}
          poster={poster}
          aria-label={alt}
          preload='none'
          controls
          playsInline
        >
          <source src={src} type='video/mp4' />
        </video>
      ) : (
        <Clip src={src} poster={poster} video={item} label={alt} />
      );
    }
    return (
      <a
        className={styles.open}
        href={largest(item)}
        onClick={(e) => open(e, item)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file(`${item.name}-${item.widths.at(-1)}.webp`)}
          srcSet={item.widths
            .map((width) => `${file(`${item.name}-${width}.webp`)} ${width}w`)
            .join(', ')}
          sizes={sizes(item.frame)}
          width={item.width}
          height={item.height}
          alt={alt}
          loading='lazy'
          decoding='async'
        />
        <span className='visually-hidden'> {openLarger}</span>
      </a>
    );
  };

  return (
    <>
      <ul className={styles.media}>
        {media.map((item) => (
          <li
            key={item.name}
            className={`${styles.item} ${
              item.kind === 'video' && item.demo ? styles.feature : ''
            }`}
          >
            <Frame frame={item.frame}>{render(item)}</Frame>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={large ? alts[large.name] : undefined}
        onClose={() => {
          setLarge(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {large && (
          <>
            <button
              type='button'
              className={styles.close}
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              {close}
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={largest(large)}
              width={large.width}
              height={large.height}
              alt={alts[large.name] ?? ''}
            />
          </>
        )}
      </dialog>
    </>
  );
}
