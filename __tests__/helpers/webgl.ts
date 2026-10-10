import { vi } from 'vitest';

// Makes the WebGL probe report the given renderer name.
export function stubWebGLRenderer(name: string) {
  return vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation((() => ({
      RENDERER: 1,
      getParameter: () => name,
      getExtension: () => null,
    })) as unknown as HTMLCanvasElement['getContext']);
}
