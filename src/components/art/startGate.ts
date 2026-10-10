// Start-up checks shared by the decorative canvases.

const VISITOR_EVENTS = [
  'pointermove',
  'pointerdown',
  'wheel',
  'touchstart',
  'keydown',
  'scroll',
] as const;
let visitorActive = false;

// Software renderers run the GPU work on the CPU, which can pin a core.
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render driver/i;
let hardwareWebGL: boolean | undefined;

export function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

// Waits for the first scroll, pointer or key input.
export function whenVisitorActive(callback: () => void) {
  if (visitorActive) {
    callback();
    return () => {};
  }
  const listeners = new AbortController();
  const onActive = () => {
    visitorActive = true;
    listeners.abort();
    callback();
  };
  VISITOR_EVENTS.forEach((type) =>
    window.addEventListener(type, onActive, {
      passive: true,
      signal: listeners.signal,
    })
  );
  return () => listeners.abort();
}

export function hasHardwareWebGL() {
  if (hardwareWebGL !== undefined) return hardwareWebGL;
  const gl = document
    .createElement('canvas')
    .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (!gl) return (hardwareWebGL = false);
  // Chrome and Safari mask RENDERER; the debug extension has the real name.
  let renderer = String(gl.getParameter(gl.RENDERER));
  const debugInfo = /webkit webgl/i.test(renderer)
    ? gl.getExtension('WEBGL_debug_renderer_info')
    : null;
  if (debugInfo)
    renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return (hardwareWebGL = !SOFTWARE_RENDERER.test(renderer));
}
