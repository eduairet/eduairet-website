/**
 * Ths spiral is based on the Archimedean spiral from this site https://codepen.io/PaperNathan/pen/gvMNJY
 */

import { FRAME_RATE, SKETCH_CONTAINER_ID } from '@/utils/client';
import type P5 from 'p5';

const sketch01 = (p: P5) => {
  let x: number, y: number;
  const mainColor = (a: number, theme: string) =>
    theme === 'light' ? `rgba(237,237,237,${a})` : `rgba(0,0,0,${a})`;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(SKETCH_CONTAINER_ID);
    p.frameRate(FRAME_RATE);
    x = p.width / 2;
    y = p.height / 2;
  };

  p.draw = () => {
    p.clear();
    p.noFill();
    p.noStroke();
    // TODO handle mouse move
    //x = p.mouseX;
    //y = p.mouseY;
    for (let i = 0; i < 200; i++) {
      const angle = p.frameCount / 9 + (i * p.PI) / 2;
      const o = p.lerp(0.00001, 0, i / 1);
      p.fill(mainColor(o, localStorage.getItem('theme') || 'dark'));
      p.ellipse(x + 5 * p.cos(angle), y + 5 * p.sin(angle), 5 * i, 5 * i);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch01;
