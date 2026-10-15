'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.scss';
import type { SpherePaths } from './spherePaths';
import { whenIdle, whenVisitorActive } from '@/components/art/startGate';

interface IProps {
  resting: SpherePaths;
}

// Drawn at rest by the server; turns once the visitor scrolls or interacts.
export default function WireSphere({ resting }: IProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nearRef = useRef<SVGPathElement>(null);
  const farRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const near = nearRef.current;
    const far = farRef.current;
    if (!svg || !near || !far) return;
    let cancelled = false;
    let cancelIdle = () => {};
    let stopTurning = () => {};
    const cancelWait = whenVisitorActive(() => {
      cancelIdle = whenIdle(() => {
        import('./turnSphere')
          .then(({ turnSphere }) => {
            if (!cancelled) stopTurning = turnSphere(svg, near, far);
          })
          // If the chunk fails to load, the sphere stays at rest.
          .catch(() => {});
      });
    });
    return () => {
      cancelled = true;
      cancelWait();
      cancelIdle();
      stopTurning();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={styles.sphere}
      viewBox={resting.viewBox}
      aria-hidden='true'
      focusable='false'
    >
      <path ref={farRef} className={styles.far} d={resting.far} />
      <path ref={nearRef} d={resting.near} />
    </svg>
  );
}
