'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.scss';
import { whenIdle, whenVisitorActive } from '@/components/art/startGate';
import {
  PROFILE_PHOTO,
  PROFILE_VIDEO,
  REDUCED_MOTION_QUERY,
  SITE_NAME,
} from '@/utils/constants';

const VIDEO_SIZE = 320;

export default function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
    let visitorActive = false;
    let onScreen = false;
    const update = () => {
      if (visitorActive && onScreen && !reducedMotion.matches)
        // If the browser refuses to play, the still stays.
        video.play().catch(() => {});
      else video.pause();
    };

    const viewport = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    viewport.observe(video);
    reducedMotion.addEventListener('change', update);
    let cancelIdle = () => {};
    const cancelWait = whenVisitorActive(() => {
      cancelIdle = whenIdle(() => {
        visitorActive = true;
        update();
      });
    });
    return () => {
      viewport.disconnect();
      reducedMotion.removeEventListener('change', update);
      cancelWait();
      cancelIdle();
      video.pause();
    };
  }, []);

  return (
    // A video can't take role="img", so the wrapper carries the name.
    <div className={styles.portrait} role='img' aria-label={SITE_NAME}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.still}
        src={PROFILE_PHOTO}
        alt=''
        width={VIDEO_SIZE}
        height={VIDEO_SIZE}
        loading='lazy'
        decoding='async'
      />
      {/* No poster: it would load eagerly. Unplayed, the video draws nothing. */}
      <video
        ref={videoRef}
        className={styles.video}
        width={VIDEO_SIZE}
        height={VIDEO_SIZE}
        aria-hidden='true'
        preload='none'
        muted
        loop
        playsInline
      >
        <source src={PROFILE_VIDEO} type='video/mp4' />
      </video>
    </div>
  );
}
