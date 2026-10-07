/*
 * Particle background.
 *
 * Inspired by "GPU Particles" by u257663 (Cyrene Chen), itself a fork of
 * "GPU Particles" by newyellow, on OpenProcessing:
 *   https://openprocessing.org/@u257663/2318301
 *   https://openprocessing.org/sketch/2318301
 * The visual was inspired by that sketch; this code is an independent
 * implementation in TypeScript and three.js and shares no code with it.
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
  // Moves the canvas into another container and resumes.
  // eslint-disable-next-line no-unused-vars
  attach: (container: HTMLElement) => void;
  // Pauses and takes the canvas out of the page, keeping GPU resources.
  detach: () => void;
  dispose: () => void;
}

// Menlo on macOS, with the usual monospaced fallbacks elsewhere. All are
// system fonts, so there is nothing to wait for.
const GLYPH_FONT = 'Menlo, Consolas, "DejaVu Sans Mono", monospace';
const ATLAS_CELL = 32;

const STEP_MS = 1000 / 30;
const STEP_SECONDS = STEP_MS / 1000;
// By this frame every particle has spawned. A spawn overwrites a particle's
// whole state, so only the last MAX_LIFE steps before it shape the still frame.
const STILL_FRAME = MAX_DELAY + MAX_LIFE;
const RESIZE_DEBOUNCE_MS = 150;
// Pointer influence fades out this long after the last move.
const POINTER_IDLE_MS = 600;
// Easing rates (1 / time constant in seconds) for MathUtils.damp.
const POINTER_RATE = 4;
const CENTER_RATE = 1;
// How far the spawn ring's center moves toward the pointer.
const CENTER_FOLLOW = 0.35;
// The ring rests right of center, away from the left-aligned content.
const REST_X = 0.7;

// Dark theme: gray light added together; the canvas's 20% opacity caps the
// result at 20% brightness. Light theme: max blending, so the darkest pixel is
// one letter at 25% black, 5% after the opacity. That keeps the red home
// subtitle (#f00, 3.42:1 on the plain background) above 3:1.
const THEMES = {
  dark: { gain: 0.8, light: 1, equation: AddEquation },
  light: { gain: 0.25, light: 0, equation: MaxEquation },
} as const;

let loggedFallback = false;

function logFallback(reason: string) {
  if (process.env.NODE_ENV === 'production' || loggedFallback) return;
  loggedFallback = true;
  console.debug(`Particle background disabled: ${reason}`);
}

// White letters on transparent, one per square cell, drawn once.
function createGlyphAtlas() {
  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_COLUMNS * ATLAS_CELL;
  atlas.height = ATLAS_COLUMNS * ATLAS_CELL;
  const context = atlas.getContext('2d');
  if (context) {
    context.font = `${ATLAS_CELL * 0.8}px ${GLYPH_FONT}`;
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

// Particle budget by viewport width. These cut-offs set GPU cost, so they are
// separate from the layout breakpoints.
function stateSizeFor(width: number) {
  if (width >= 1024) return 128;
  if (width >= 640) return 96;
  return 64;
}

// Setup takes about 80 ms on a slow phone (4x CPU throttle). Yielding between
// its three parts keeps each task under 50 ms.
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

  // The context above already sets alpha, antialias and power preference.
  const renderer = new WebGLRenderer({ canvas, context: gl, depth: false });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  await nextTask();

  // Simulation: one RGBA texel per particle, ping-ponged every step. Every
  // particle starts at zero (waiting to spawn), so a 1x1 zero texture fills
  // the whole state.
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
  const pointer = new Vector3(width * REST_X, height / 2, 0);
  const center = new Vector2(width * REST_X, height / 2);
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

  // Drawing: one instanced quad per particle.
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

  const draw = {
    uState: { value: null as Texture | null },
    uFrame: update.uFrame,
    uViewport: update.uViewport,
    uGain: { value: 0 },
    uLight: { value: 0 },
    uAtlas: { value: createGlyphAtlas() },
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

  // Inputs, written by listeners and read by the loop.
  let pointerActive = false;
  let lastPointerMove = 0;
  let running = false;
  let attached = false;
  // Set once both shader programs have compiled.
  let ready = false;
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
    material.blendEquation = settings.equation;
    material.blendEquationAlpha = settings.equation;
  };

  const step = (now: number) => {
    const moving = pointerActive && now - lastPointerMove < POINTER_IDLE_MS;
    pointer.z = MathUtils.damp(
      pointer.z,
      moving ? 1 : 0,
      POINTER_RATE,
      STEP_SECONDS
    );
    const follow = CENTER_FOLLOW * pointer.z;
    const targetX = MathUtils.lerp(width * REST_X, pointer.x, follow);
    const targetY = MathUtils.lerp(height / 2, pointer.y, follow);
    center.x = MathUtils.damp(center.x, targetX, CENTER_RATE, STEP_SECONDS);
    center.y = MathUtils.damp(center.y, targetY, CENTER_RATE, STEP_SECONDS);

    update.uFrame.value += 1;
    update.uTime.value += STEP_SECONDS;
    compute.compute();
  };

  const render = () => {
    draw.uState.value = compute.getCurrentRenderTarget(state).texture;
    renderer.render(scene, camera);
  };

  const loop = (now: number) => {
    // setAnimationLoop runs at the display rate; step at 30 fps.
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

  // Redraws the still frame after a theme or size change.
  const redraw = () => {
    if (ready && attached && !running) render();
  };

  const start = () => {
    if (
      running ||
      !ready ||
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
    if (!ready || !attached) return;
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
      redraw();
    }, RESIZE_DEBOUNCE_MS);
  };

  // One abort removes every listener.
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
  // React keeps the same <body> across layout remounts, so one observer
  // covers the whole session.
  const themeObserver = new MutationObserver(() => {
    applyTheme(readTheme());
    redraw();
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

  // Compile both programs before the first frame. With
  // KHR_parallel_shader_compile the driver does it off the main thread, so the
  // first frame never blocks on it. The update program is compiled with its
  // render target bound, so it matches the program used at run time.
  const updateScene = new Scene();
  updateScene.add(new Mesh(geometry, state.material));
  renderer.setRenderTarget(compute.getCurrentRenderTarget(state));
  const updateReady = renderer.compileAsync(updateScene, camera);
  renderer.setRenderTarget(null);
  const drawReady = renderer.compileAsync(scene, camera);
  Promise.all([updateReady, drawReady]).then(() => {
    ready = true;
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
      draw.uAtlas.value.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
