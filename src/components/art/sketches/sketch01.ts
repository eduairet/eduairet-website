import { FRAME_RATE, SKETCH_CONTAINER_ID } from '@/utils/constants';
import type P5 from 'p5';

const sketch01 = (p: P5) => {
  let x: number, y: number;
  let theme: string;
  const isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
  );
  const mainColor = (a: number) =>
    theme === 'dark' ? `rgba(237,237,237,${a})` : `rgba(0,0,0,${a})`;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(SKETCH_CONTAINER_ID);
    p.frameRate(FRAME_RATE);
    x = p.width / 2;
    y = p.height / 2;
  };

  p.draw = () => {
    theme = localStorage.getItem('theme') || 'dark';
    p.clear();
    p.noStroke();
    drawShape();
    updatePosition();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  function updatePosition() {
    if (!isMobile) {
      x = p.mouseX;
      y = p.mouseY;
    }
  }

  function drawShape() {
    const shapes = 100;
    const distance = 10;
    for (let i = shapes; i > 0; i--) {
      const angle = p.frameCount / 20 + (i * p.PI * 0.1) / 2;
      const size = distance * (shapes - i);
      const o = p.lerp(0, 0.003, i / shapes);
      const shapeColor = mainColor(o);
      p.push();
      p.fill(shapeColor);
      p.ellipse(
        x + distance * p.cos(angle),
        y + distance * p.sin(angle),
        size,
        size
      );
      p.pop();
    }
  }
};

export default sketch01;
