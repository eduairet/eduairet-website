import { FRAME_RATE, SKETCH_CONTAINER_ID } from '@/utils/client';
import type P5 from 'p5';

const sketch01 = (p: P5) => {
  let size = 1500;
  let spiralWidth = 0.1;
  let angle = 80;
  let w: number, h: number, oldX: number, oldY: number;
  let theme: string;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(SKETCH_CONTAINER_ID);
    p.pixelDensity(2);
    p.frameRate(FRAME_RATE);
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    theme = localStorage.getItem('theme') || 'dark';
    w = p.width;
    h = p.height;
    p.clear();
    p.noFill();
    p.stroke(theme === 'dark' ? '#ededed' : '#000');
    p.strokeWeight(1);
    drawSpiral();
    spiralWidth = 0.1 + 0.45 * (Math.sin(p.frameCount / 100) + 1);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  function drawSpiral() {
    oldX = w / 2;
    oldY = h / 2;

    for (let i = 0; i < size; i++) {
      let newAngle = (angle / 10) * i;
      let x = w / 2 + spiralWidth * newAngle * p.sin(newAngle);
      let y = h / 2 + spiralWidth * newAngle * p.cos(newAngle);
      p.line(oldX, oldY, x, y);
      oldX = x;
      oldY = y;
    }
  }
};

export default sketch01;
