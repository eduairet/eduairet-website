import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import ParticleBackground from '@/components/art/ParticleBackground/ParticleBackground';
import { MAX_LIFE } from '@/components/art/ParticleBackground/particleShaders';

// jsdom has no WebGL, so three.js is replaced by stubs that record calls.
const three = vi.hoisted(() => ({
  renderers: [] as Array<{
    canvas: HTMLCanvasElement;
    setAnimationLoop: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    forceContextLoss: ReturnType<typeof vi.fn>;
  }>,
  // Called when a renderer is created, to act mid-setup.
  onRenderer: null as null | (() => void),
  computes: [] as Array<{
    compute: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  }>,
}));

vi.mock('three', () => {
  class Vector2 {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x: number, y: number) {
      this.x = x;
      this.y = y;
      return this;
    }
  }
  class Vector3 extends Vector2 {
    z: number;
    constructor(x = 0, y = 0, z = 0) {
      super(x, y);
      this.z = z;
    }
  }
  class Disposable {
    dispose = vi.fn();
  }
  class WebGLRenderer {
    canvas: HTMLCanvasElement;
    setAnimationLoop = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
    forceContextLoss = vi.fn();
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    setClearColor = vi.fn();
    setRenderTarget = vi.fn();
    compileAsync = vi.fn(() => Promise.resolve());
    constructor({ canvas }: { canvas: HTMLCanvasElement }) {
      this.canvas = canvas;
      three.renderers.push(this);
      three.onRenderer?.();
    }
  }
  class InstancedBufferGeometry extends Disposable {
    instanceCount = 0;
    setAttribute = vi.fn();
    setIndex = vi.fn();
  }
  class ShaderMaterial extends Disposable {
    blendEquation = 0;
    blendEquationAlpha = 0;
  }
  class Mesh {
    frustumCulled = true;
  }
  class Scene {
    add = vi.fn();
  }
  return {
    Camera: class {},
    CanvasTexture: Disposable,
    DataTexture: Disposable,
    MathUtils: {
      lerp: (x: number, y: number, t: number) => x + (y - x) * t,
      damp: (x: number, y: number, lambda: number, dt: number) =>
        x + (y - x) * (1 - Math.exp(-lambda * dt)),
    },
    BufferAttribute: class {},
    InstancedBufferGeometry,
    Mesh,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector3,
    WebGLRenderer,
    CustomBlending: 5,
    DoubleSide: 2,
    AddEquation: 100,
    MaxEquation: 104,
    OneFactor: 201,
    FloatType: 1015,
    HalfFloatType: 1016,
    RGBAFormat: 1023,
  };
});

vi.mock('three/addons/misc/GPUComputationRenderer.js', () => ({
  GPUComputationRenderer: class {
    compute = vi.fn();
    dispose = vi.fn();
    setDataType = vi.fn();
    setVariableDependencies = vi.fn();
    createTexture = vi.fn();
    addVariable = () => ({ material: { uniforms: {} } });
    init = () => null;
    getCurrentRenderTarget = () => ({ texture: {} });
    constructor() {
      three.computes.push(this);
    }
  },
}));

let reducedMotion = false;

beforeEach(() => {
  vi.useFakeTimers();
  three.renderers.length = 0;
  three.computes.length = 0;
  three.onRenderer = null;
  reducedMotion = false;
  // jsdom lacks requestIdleCallback, so the component's setTimeout fallback
  // runs; matchMedia and canvas contexts are stubbed.
  window.matchMedia = vi.fn(() => ({
    matches: reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(((
    type: string
  ) =>
    type === 'webgl2'
      ? {
          getExtension: (name: string) =>
            name === 'EXT_color_buffer_float' ? {} : null,
        }
      : { fillText: vi.fn() }) as unknown as HTMLCanvasElement['getContext']);
});

afterEach(async () => {
  cleanup();
  // Let a retained scene finish its delayed disposal.
  await vi.runAllTimersAsync();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// Idle callback, three.js import, second idle callback, two setup tasks, then
// shader compilation; the scene is up once it has drawn or started its loop.
const startScene = () =>
  vi.waitFor(
    () => {
      const [renderer] = three.renderers;
      expect(renderer?.canvas.isConnected).toBe(true);
      expect(
        renderer.render.mock.calls.length +
          renderer.setAnimationLoop.mock.calls.length
      ).toBeGreaterThan(0);
    },
    { timeout: 5000 }
  );

describe('Particle background', () => {
  test('server render is an empty, aria-hidden container', () => {
    const html = renderToString(<ParticleBackground />);

    expect(html).toMatch(/^<div class="[^"]+" aria-hidden="true"><\/div>$/);
    expect(html).not.toContain('canvas');
  });

  test('mounts one canvas after idle and starts the loop', async () => {
    const { container } = render(<ParticleBackground />);
    expect(container.querySelector('canvas')).toBeNull();

    await startScene();

    expect(container.querySelectorAll('canvas')).toHaveLength(1);
    expect(three.renderers[0].setAnimationLoop).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  test('cleanup disposes of the renderer and removes the canvas', async () => {
    const { container, unmount } = render(<ParticleBackground />);
    await startScene();
    const [renderer] = three.renderers;

    unmount();
    await act(() => vi.advanceTimersByTimeAsync(1000));

    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(renderer.forceContextLoss).toHaveBeenCalledOnce();
    expect(three.computes[0].dispose).toHaveBeenCalledOnce();
    expect(renderer.canvas.isConnected).toBe(false);
    expect(container.querySelector('canvas')).toBeNull();
  });

  test('a remount right after unmount keeps the same renderer', async () => {
    const first = render(<ParticleBackground />);
    await startScene();
    const [renderer] = three.renderers;

    first.unmount();
    const second = render(<ParticleBackground />);
    await act(() => vi.advanceTimersByTimeAsync(2000));

    expect(three.renderers).toHaveLength(1);
    expect(renderer.dispose).not.toHaveBeenCalled();
    expect(second.container.querySelector('canvas')).toBe(renderer.canvas);
  });

  test('unmounting before three.js loads never starts a scene', async () => {
    // Warm the module cache so the dynamic import resolves quickly.
    await import('@/components/art/ParticleBackground/particleScene');
    const { unmount } = render(<ParticleBackground />);

    // Fire the idle callback, which starts the import, then leave at once.
    vi.advanceTimersByTime(250);
    unmount();
    await act(() => vi.advanceTimersByTimeAsync(5000));

    expect(three.renderers).toHaveLength(0);
    expect(document.querySelector('canvas')).toBeNull();
  });

  test('unmounting halfway through setup disposes of the new scene', async () => {
    const { unmount } = render(<ParticleBackground />);
    // Leave as soon as the renderer exists, before the canvas is attached.
    three.onRenderer = () => unmount();
    await vi.waitFor(() => expect(three.renderers).toHaveLength(1), {
      timeout: 5000,
    });
    const [renderer] = three.renderers;
    await act(() => vi.advanceTimersByTimeAsync(2000));

    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(renderer.canvas.isConnected).toBe(false);
    expect(renderer.setAnimationLoop).not.toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  test('with reduced motion it renders one frame and never starts the loop', async () => {
    reducedMotion = true;
    render(<ParticleBackground />);
    await startScene();
    await act(() => vi.advanceTimersByTimeAsync(3000));
    const [renderer] = three.renderers;

    expect(renderer.render).toHaveBeenCalledOnce();
    expect(renderer.setAnimationLoop).not.toHaveBeenCalledWith(
      expect.any(Function)
    );
    // The still frame shows a settled field: the last MAX_LIFE steps decide
    // every particle, so exactly that many run.
    expect(three.computes[0].compute).toHaveBeenCalledTimes(MAX_LIFE);
  });
});
