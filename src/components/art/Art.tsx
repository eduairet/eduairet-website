'use client';

import type P5 from 'p5';
import { useState, useEffect, useRef } from 'react';
import styles from './Art.module.scss';
import sketches from './sketches';
import { SketchContainerRef } from '@/models';

interface IProps {
  currentSketch?: number;
}

export default function Art({ currentSketch = 1 }: IProps) {
  const containerRef = useRef<SketchContainerRef>();
  const [isMounted, setIsMounted] = useState(false);
  const sketch = sketches[`sketch${currentSketch.toString().padStart(2, '0')}`];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let sketchInstance: P5;
    const initSketch = async () => {
      try {
        const p5 = (await import('p5')).default;
        new p5((p) => {
          sketch(p, containerRef.current!);
          sketchInstance = p;
        });
      } catch (error) {
        console.log(error);
      }
    };
    initSketch();

    return () => sketchInstance!.remove();
  }, [isMounted, sketch]);

  // @ts-ignore
  return <div id='art' className={styles.sketch} ref={containerRef}></div>;
}
