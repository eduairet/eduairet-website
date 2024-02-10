/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */

import type P5 from 'p5';
import { JSX } from 'react';

export type SketchContainerRef = HTMLDivElement;

export type Sketch = (p: P5, parentRef: SketchContainerRef) => void;

export type SketchContainer = ({ sketch }: { sketch: Sketch }) => JSX.Element;

export type Sketches = {
  [key: string]: Sketch;
};
