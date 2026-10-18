'use client';

import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.scss';
import type { ParticleScene } from './particleScene';
import {
  hasHardwareWebGL,
  whenIdle,
  whenVisitorActive,
} from '@/components/art/startGate';

// Locale switches remount the layout. Reuse the scene so one WebGL context survives.
const RELEASE_DELAY_MS = 1000;
let retained: {
  scene: ParticleScene;
  timer: ReturnType<typeof setTimeout>;
} | null = null;

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let scene: ParticleScene | null = null;
    let cancelIdle = () => {};
    let cancelWait = () => {};

    if (retained && containerRef.current) {
      clearTimeout(retained.timer);
      scene = retained.scene;
      retained = null;
      scene.attach(containerRef.current);
    } else {
      const start = async () => {
        if (!hasHardwareWebGL()) return;
        const { createParticleScene } = await import('./particleScene');
        if (cancelled) return;
        // Yield between loading three.js and building the scene, so a phone is not blocked.
        await new Promise<void>((resolve) => {
          cancelIdle = whenIdle(resolve);
        });
        if (cancelled || !containerRef.current) return;
        const created = await createParticleScene(containerRef.current);
        if (cancelled) created?.dispose();
        else scene = created;
      };
      cancelWait = whenVisitorActive(() => {
        cancelIdle = whenIdle(() => {
          start().catch(() => {});
        });
      });
    }

    return () => {
      cancelled = true;
      cancelWait();
      cancelIdle();
      if (!scene) return;
      const kept = scene;
      kept.detach();
      retained = {
        scene: kept,
        timer: setTimeout(() => {
          if (retained?.scene === kept) retained = null;
          kept.dispose();
        }, RELEASE_DELAY_MS),
      };
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.background} aria-hidden='true' />
  );
}
