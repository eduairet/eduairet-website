/*
 * Visual inspired by "GPU Particles" by u257663 (a fork of newyellow's sketch):
 *   https://openprocessing.org/@u257663/2318301
 *   https://openprocessing.org/sketch/2318301
 * Independent implementation; no code is shared with the original.
 */
import {
  Camera,
  CanvasTexture,
  CustomBlending,
  AddEquation,
  MaxEquation,
  OneFactor,
  DataTexture,
  FloatType,
  HalfFloatType,
  RGBAFormat,
  BufferAttribute,
  InstancedBufferGeometry,
  MathUtils,
  Mesh,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Texture,
  type TextureDataType,
} from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import type { Theme } from '@/hooks/useDarkMode';
import {
  ATLAS_COLUMNS,
  GLYPHS,
  MAX_DELAY,
  MAX_LIFE,
  drawFragmentShader,
  drawVertexShader,
  updateShader,
} from './particleShaders';

export interface ParticleScene {
  // eslint-disable-next-line no-unused-vars
  attach: (container: HTMLElement) => void;
  // Keeps GPU resources so a later attach is instant.
  detach: () => void;
  dispose: () => void;
}

// System fonts only, so there is nothing to load.
const GLYPH_FONT = 'Menlo, Consolas, "DejaVu Sans Mono", monospace';
const ATLAS_CELL = 32;

const STEP_MS = 1000 / 30;
const STEP_SECONDS = STEP_MS / 1000;
// Every particle has spawned by now, and only its last MAX_LIFE steps matter.
const STILL_FRAME = MAX_DELAY + MAX_LIFE;
const RESIZE_DEBOUNCE_MS = 150;
const POINTER_IDLE_MS = 600;
const POINTER_DAMPING = 4;
const RING_DAMPING = 1;
const RING_FOLLOW_POINTER = 0.35;
// Right of center, away from the left-aligned text.
const RING_REST_X = 0.7;

// The light gain keeps the red home subtitle above 3:1 contrast, so light
// letters are bold to read better without getting darker.
const THEMES = {
  dark: { gain: 0.8, light: 1, equation: AddEquation, weight: 'normal' },
  light: { gain: 0.265, light: 0, equation: MaxEquation, weight: 'bold' },
} as const;

let loggedFallback = false;

function logFallback(reason: string) {
  if (process.env.NODE_ENV === 'production' || loggedFallback) return;
  loggedFallback = true;
  console.debug(`Particle background disabled: ${reason}`);
}

function createGlyphAtlas(weight: 'normal' | 'bold') {
  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_COLUMNS * ATLAS_CELL;
  atlas.height = ATLAS_COLUMNS * ATLAS_CELL;
  const context = atlas.getContext('2d');
  if (context) {
    context.font = `${weight} ${ATLAS_CELL * 0.8}px ${GLYPH_FONT}`;
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    [...GLYPHS].forEach((glyph, index) => {
      const column = index % ATLAS_COLUMNS;
      const row = Math.floor(index / ATLAS_COLUMNS);
      context.fillText(
        glyph,
        (column + 0.5) * ATLAS_CELL,
        (row + 0.5) * ATLAS_CELL
      );
    });
  }
  return new CanvasTexture(atlas);
}

// Sized for GPU cost, not tied to the layout breakpoints.
function stateSizeFor(width: number) {
  if (width >= 1024) return 128;
  if (width >= 640) return 96;
  return 64;
}

// Splits setup so it never blocks a slow phone for 50 ms or more.
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function readTheme(): Theme {
  return document.body.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark';
}

export async function createParticleScene(
  initialContainer: HTMLElement
): Promise<ParticleScene | null> {
  let container = initialContainer;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) {
    logFallback('WebGL 2 is not available.');
    return null;
  }

  let dataType: TextureDataType;
  if (gl.getExtension('EXT_color_buffer_float')) dataType = FloatType;
  else if (gl.getExtension('EXT_color_buffer_half_float'))
    dataType = HalfFloatType;
  else {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    logFallback('float render targets are not available.');
    return null;
  }

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;
  const stateSize = stateSizeFor(width);

  const renderer = new WebGLRenderer({ canvas, context: gl, depth: false });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  await nextTask();

  // Every particle starts at zero (not spawned yet), so 1x1 is enough.
  const compute = new GPUComputationRenderer(stateSize, stateSize, renderer);
  compute.setDataType(dataType);
  const zero = new DataTexture(
    new Float32Array(4),
    1,
    1,
    RGBAFormat,
    FloatType
  );
  zero.needsUpdate = true;
  const state = compute.addVariable('uState', updateShader, zero);
  compute.setVariableDependencies(state, [state]);
  const pointer = new Vector3(width * RING_REST_X, height / 2, 0);
  const center = new Vector2(width * RING_REST_X, height / 2);
  const viewport = new Vector2(width, height);
  const update = {
    uFrame: { value: 0 },
    uTime: { value: 0 },
    uViewport: { value: viewport },
    uCenter: { value: center },
    uRadius: { value: 0 },
    uStep: { value: 0 },
    uPointer: { value: pointer },
    uPointerRadius: { value: 0 },
  };
  Object.assign(state.material.uniforms, update);

  const initError = compute.init();
  if (initError !== null) {
    compute.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    logFallback(initError);
    return null;
  }

  await nextTask();

  const geometry = new InstancedBufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array([
        -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
      ]),
      3
    )
  );
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.instanceCount = stateSize * stateSize;

  const atlases = {
    normal: createGlyphAtlas('normal'),
    bold: createGlyphAtlas('bold'),
  };
  const draw = {
    uState: { value: null as Texture | null },
    uFrame: update.uFrame,
    uViewport: update.uViewport,
    uGain: { value: 0 },
    uLight: { value: 0 },
    uAtlas: { value: atlases.normal },
  };
  const material = new ShaderMaterial({
    uniforms: draw,
    vertexShader: drawVertexShader,
    fragmentShader: drawFragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneFactor,
    blendSrcAlpha: OneFactor,
    blendDstAlpha: OneFactor,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  const scene = new Scene();
  scene.add(mesh);
  const camera = new Camera();

  let pointerActive = false;
  let lastPointerMove = 0;
  let running = false;
  let attached = false;
  let compiled = false;
  let lastStep = -Infinity;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const layout = () => {
    const short = Math.min(width, height);
    viewport.set(width, height);
    update.uRadius.value = short * 0.25;
    update.uPointerRadius.value = short * 0.25;
    update.uStep.value = short * 0.001;
  };

  const applyTheme = (theme: Theme) => {
    const settings = THEMES[theme];
    draw.uGain.value = settings.gain;
    draw.uLight.value = settings.light;
    draw.uAtlas.value = atlases[settings.weight];
    material.blendEquation = settings.equation;
    material.blendEquationAlpha = settings.equation;
  };

  const step = (now: number) => {
    const moving = pointerActive && now - lastPointerMove < POINTER_IDLE_MS;
    pointer.z = MathUtils.damp(
      pointer.z,
      moving ? 1 : 0,
      POINTER_DAMPING,
      STEP_SECONDS
    );
    const follow = RING_FOLLOW_POINTER * pointer.z;
    const targetX = MathUtils.lerp(width * RING_REST_X, pointer.x, follow);
    const targetY = MathUtils.lerp(height / 2, pointer.y, follow);
    center.x = MathUtils.damp(center.x, targetX, RING_DAMPING, STEP_SECONDS);
    center.y = MathUtils.damp(center.y, targetY, RING_DAMPING, STEP_SECONDS);

    update.uFrame.value += 1;
    update.uTime.value += STEP_SECONDS;
    compute.compute();
  };

  const render = () => {
    draw.uState.value = compute.getCurrentRenderTarget(state).texture;
    renderer.render(scene, camera);
  };

  const loop = (now: number) => {
    // Called at the display rate; step at 30 fps.
    if (now - lastStep < STEP_MS - 1) return;
    lastStep = now;
    step(now);
    render();
  };

  const renderStill = () => {
    if (update.uFrame.value < STILL_FRAME) {
      pointerActive = false;
      pointer.z = 0;
      const first = STILL_FRAME - MAX_LIFE;
      if (update.uFrame.value < first) {
        update.uFrame.value = first;
        update.uTime.value = first * STEP_SECONDS;
      }
      while (update.uFrame.value < STILL_FRAME) step(0);
    }
    render();
  };

  const redrawStill = () => {
    if (compiled && attached && !running) render();
  };

  const start = () => {
    if (
      running ||
      !compiled ||
      !attached ||
      reducedMotion.matches ||
      document.hidden
    )
      return;
    running = true;
    renderer.setAnimationLoop(loop);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
  };

  const show = () => {
    if (!compiled || !attached) return;
    if (reducedMotion.matches) {
      stop();
      renderStill();
    } else start();
  };

  const measure = () => {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    layout();
  };

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointerActive = true;
    lastPointerMove = performance.now();
  };
  const onPointerEnd = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') pointerActive = false;
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };
  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      redrawStill();
    }, RESIZE_DEBOUNCE_MS);
  };

  const listeners = new AbortController();
  const { signal } = listeners;
  const passive = { passive: true, signal };
  window.addEventListener('pointermove', onPointerMove, passive);
  window.addEventListener('pointerdown', onPointerMove, passive);
  window.addEventListener('pointerup', onPointerEnd, passive);
  window.addEventListener('pointercancel', onPointerEnd, passive);
  window.addEventListener('resize', onResize, passive);
  window.addEventListener('blur', onPointerLeave, { signal });
  document.documentElement.addEventListener('pointerleave', onPointerLeave, {
    signal,
  });
  document.addEventListener('visibilitychange', onVisibility, { signal });
  reducedMotion.addEventListener('change', show, { signal });
  // React keeps the same <body> across locale switches.
  const themeObserver = new MutationObserver(() => {
    applyTheme(readTheme());
    redrawStill();
  });
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const attach = (next: HTMLElement) => {
    container = next;
    container.appendChild(canvas);
    attached = true;
    applyTheme(readTheme());
    measure();
    show();
  };

  const detach = () => {
    stop();
    attached = false;
    canvas.remove();
  };

  attach(container);

  // Compile shaders off the main thread before the first frame. The update
  // shader needs its render target bound to match the one used at run time.
  const updateScene = new Scene();
  updateScene.add(new Mesh(geometry, state.material));
  renderer.setRenderTarget(compute.getCurrentRenderTarget(state));
  const updateReady = renderer.compileAsync(updateScene, camera);
  renderer.setRenderTarget(null);
  const drawReady = renderer.compileAsync(scene, camera);
  Promise.all([updateReady, drawReady]).then(() => {
    compiled = true;
    show();
  });

  return {
    attach,
    detach,
    dispose() {
      detach();
      clearTimeout(resizeTimer);
      listeners.abort();
      themeObserver.disconnect();
      compute.dispose();
      geometry.dispose();
      material.dispose();
      atlases.normal.dispose();
      atlases.bold.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
