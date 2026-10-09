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

const VISITOR_EVENTS = [
  'pointermove',
  'pointerdown',
  'wheel',
  'touchstart',
  'keydown',
  'scroll',
] as const;
let visitorActive = false;

// Software renderers run the GPU work on the CPU, which can pin a core.
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render driver/i;
let hardwareWebGL: boolean | undefined;

function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

// Waits for the first scroll, pointer or key input, so the scene never
// competes with the page load.
function whenVisitorActive(callback: () => void) {
  if (visitorActive) {
    callback();
    return () => {};
  }
  const listeners = new AbortController();
  const onActive = () => {
    visitorActive = true;
    listeners.abort();
    callback();
  };
  VISITOR_EVENTS.forEach((type) =>
    window.addEventListener(type, onActive, {
      passive: true,
      signal: listeners.signal,
    })
  );
  return () => listeners.abort();
}

function hasHardwareWebGL() {
  if (hardwareWebGL !== undefined) return hardwareWebGL;
  const gl = document
    .createElement('canvas')
    .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (!gl) return (hardwareWebGL = false);
  // Chrome and Safari mask RENDERER; the debug extension has the real name.
  let renderer = String(gl.getParameter(gl.RENDERER));
  const debugInfo = /webkit webgl/i.test(renderer)
    ? gl.getExtension('WEBGL_debug_renderer_info')
    : null;
  if (debugInfo)
    renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return (hardwareWebGL = !SOFTWARE_RENDERER.test(renderer));
}

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
      cancelWait = whenVisitorActive(() => {
        cancelIdle = whenIdle(() => {
          // If three.js fails to load, the page simply has no background.
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
