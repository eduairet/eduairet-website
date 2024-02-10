/**
 * Ths spiral is based on the Archimedean spiral from this site https://codepen.io/PaperNathan/pen/gvMNJY
 */

import { FRAME_RATE, SKETCH_CONTAINER_ID } from '@/utils/client';
import type P5 from 'p5';

const sketch01 = (p: P5) => {
  let theme: string;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(SKETCH_CONTAINER_ID);
    p.frameRate(FRAME_RATE);
  };

  p.draw = () => {
    theme = localStorage.getItem('theme') || 'dark';
    p.clear();
    p.noFill();
    p.fill(theme === 'dark' ? '#ededed' : '#000');
    p.noStroke();
    for (let i = 0; i < 40; i++) {
      const angle = p.frameCount / 9 + (i * p.PI) / 2;
      p.ellipse(
        p.mouseX + 5 * p.cos(angle),
        p.mouseY + 5 * p.sin(angle),
        100,
        100
      );
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch01;
