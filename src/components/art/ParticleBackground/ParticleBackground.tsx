'use client';

import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.scss';
import type { ParticleScene } from './particleScene';

// Switching locale remounts the root layout. Holding the scene for a moment
// after unmount lets the next mount adopt it, so the session keeps one WebGL
// context instead of creating a new one per switch.
const RELEASE_DELAY_MS = 1000;
let retained: {
  scene: ParticleScene;
  timer: ReturnType<typeof setTimeout>;
} | null = null;

// Runs `callback` once the page is idle, so three.js never competes with the
// first paint or the page enter animation. Returns a cancel function.
function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

// Decorative WebGL particle field behind every page. The server renders only
// the empty container; three.js is loaded on the client after idle.
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
        // Evaluating three.js and building the scene each take a few dozen
        // ms on a slow phone; a turn between them keeps both under 50 ms.
        await new Promise<void>((resolve) => {
          cancelIdle = whenIdle(resolve);
        });
        if (cancelled || !containerRef.current) return;
        const created = await createParticleScene(containerRef.current);
        if (cancelled) created?.dispose();
        else scene = created;
      };
      cancelIdle = whenIdle(() => {
        // A failed chunk load just leaves the page without a background.
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
