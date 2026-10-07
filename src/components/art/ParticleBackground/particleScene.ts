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
  DoubleSide,
  AddEquation,
  MaxEquation,
  OneFactor,
  FloatType,
  HalfFloatType,
  BufferAttribute,
  InstancedBufferGeometry,
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
import {
  ATLAS_COLUMNS,
  GLYPHS,
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

type Theme = 'dark' | 'light';

// Menlo on macOS, with the usual monospaced fallbacks elsewhere. All are
// system fonts, so there is nothing to wait for.
const GLYPH_FONT = 'Menlo, Consolas, "DejaVu Sans Mono", monospace';
const ATLAS_CELL = 32;

const STEP_MS = 1000 / 30;
const STEP_SECONDS = STEP_MS / 1000;
// Enough steps for every particle to have spawned (the longest delay is 300).
const STILL_FRAME_STEPS = 360;
const RESIZE_DEBOUNCE_MS = 150;
// Pointer influence fades out this long after the last move.
const POINTER_IDLE_MS = 600;
const POINTER_EASE = 1 - Math.exp(-STEP_SECONDS / 0.25);
const CENTER_EASE = 1 - Math.exp(-STEP_SECONDS / 1);
// How far the spawn ring's center moves toward the pointer.
const CENTER_FOLLOW = 0.35;
// The ring rests right of center, away from the left-aligned content.
const REST_X = 0.7;

// Dark theme: gray light added together. The overlay in the stylesheet caps
// the result at 20% brightness. Light theme: max blending, so the darkest
// pixel is one particle at 25% black, 5% after the overlay. That keeps the red
// home subtitle (#f00, 3.42:1 on the plain background) above 3:1.
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

function stateSizeFor(width: number) {
  if (width >= 1024) return 128;
  if (width >= 640) return 96;
  return 64;
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

  const renderer = new WebGLRenderer({
    canvas,
    context: gl,
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  // Simulation: one RGBA texel per particle, ping-ponged every step.
  const compute = new GPUComputationRenderer(stateSize, stateSize, renderer);
  compute.setDataType(dataType);
  const state = compute.addVariable(
    'uState',
    updateShader,
    compute.createTexture()
  );
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

  // Setup takes about 70 ms on a slow phone (4x CPU throttle); splitting it
  // here keeps each task under 50 ms.
  await new Promise((resolve) => setTimeout(resolve, 0));

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
    uStateSize: { value: stateSize },
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
    side: DoubleSide,
    // Without this, three draws transparent double-sided meshes in two passes.
    forceSinglePass: true,
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
  let disposed = false;
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
    pointer.z += ((moving ? 1 : 0) - pointer.z) * POINTER_EASE;
    const follow = CENTER_FOLLOW * pointer.z;
    const restX = width * REST_X;
    const targetX = restX + (pointer.x - restX) * follow;
    const targetY = height / 2 + (pointer.y - height / 2) * follow;
    center.x += (targetX - center.x) * CENTER_EASE;
    center.y += (targetY - center.y) * CENTER_EASE;

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
    if (update.uFrame.value < STILL_FRAME_STEPS) {
      pointerActive = false;
      pointer.z = 0;
      while (update.uFrame.value < STILL_FRAME_STEPS) step(0);
    }
    render();
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
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      if (ready && attached && !running) render();
    }, RESIZE_DEBOUNCE_MS);
  };
  const themeObserver = new MutationObserver(() => {
    applyTheme(readTheme());
    if (ready && attached && !running) render();
  });

  const listen = { passive: true } as const;
  window.addEventListener('pointermove', onPointerMove, listen);
  window.addEventListener('pointerdown', onPointerMove, listen);
  window.addEventListener('pointerup', onPointerEnd, listen);
  window.addEventListener('pointercancel', onPointerEnd, listen);
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('resize', onResize, listen);
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', show);

  const attach = (next: HTMLElement) => {
    container = next;
    container.appendChild(canvas);
    attached = true;
    // A remounted layout can bring a new <body>.
    themeObserver.disconnect();
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    applyTheme(readTheme());
    measure();
    show();
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
    if (disposed) return;
    ready = true;
    show();
  });

  return {
    attach,
    detach() {
      stop();
      attached = false;
      canvas.remove();
    },
    dispose() {
      disposed = true;
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener(
        'pointerleave',
        onPointerLeave
      );
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', show);
      themeObserver.disconnect();
      compute.dispose();
      geometry.dispose();
      material.dispose();
      draw.uAtlas.value.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
