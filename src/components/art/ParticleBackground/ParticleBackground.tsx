'use client';

import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.scss';
import type { ParticleScene } from './particleScene';

// Switching locale remounts the layout. Keeping the scene briefly lets the
// next mount reuse it, so the page keeps a single WebGL context.
const RELEASE_DELAY_MS = 1000;
let retained: {
  scene: ParticleScene;
  timer: ReturnType<typeof setTimeout>;
} | null = null;

function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let scene: ParticleScene | null = null;
    let cancelIdle = () => {};

    if (retained && containerRef.current) {
      clearTimeout(retained.timer);
      scene = retained.scene;
      retained = null;
      scene.attach(containerRef.current);
    } else {
      const start = async () => {
        const { createParticleScene } = await import('./particleScene');
        if (cancelled) return;
        // Pause between loading three.js and building the scene; both are
        // slow on phones.
        await new Promise<void>((resolve) => {
          cancelIdle = whenIdle(resolve);
        });
        if (cancelled || !containerRef.current) return;
        const created = await createParticleScene(containerRef.current);
        if (cancelled) created?.dispose();
        else scene = created;
      };
      cancelIdle = whenIdle(() => {
        // If three.js fails to load, the page simply has no background.
        start().catch(() => {});
      });
    }

    return () => {
      cancelled = true;
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
