// Simplex noise by Ian McEwan, Ashima Arts (https://github.com/ashima/webgl-noise).
//
// Copyright (C) 2011 by Ashima Arts (Simplex noise)
// Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
const simplexNoise3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// Random spawn delays make the field fade in instead of popping.
const MIN_LIFE = 15;
export const MAX_LIFE = 90;
export const MAX_DELAY = 300;

// Randomness comes from hashing each particle's texel, so both shaders agree
// on its age without a seed texture.
const lifeCycle = /* glsl */ `
#define TAU 6.283185307179586

uint hash(uint x) {
  x ^= x >> 16;
  x *= 0x7feb352dU;
  x ^= x >> 15;
  x *= 0x846ca68bU;
  x ^= x >> 16;
  return x;
}

float unitRandom(uint x) {
  return float(hash(x)) * (1.0 / 4294967295.0);
}

struct Cycle {
  bool started;
  float age;
  float life;
  uint seed;
};

Cycle lifeCycle(uvec2 cell, float frame) {
  uint id = cell.x + cell.y * 4096u;
  float life = ${MIN_LIFE}.0 + floor(unitRandom(id * 3u) * ${MAX_LIFE - MIN_LIFE + 1}.0);
  float delay = floor(unitRandom(id * 3u + 1u) * ${MAX_DELAY + 1}.0);
  float t = frame - delay;
  float cycle = floor(t / life);
  Cycle c;
  c.started = t >= 0.0;
  c.age = t - cycle * life;
  c.life = life;
  c.seed = hash(id ^ hash(uint(max(cycle, 0.0)) + 0x632be5abU));
  return c;
}
`;

// State per particle: position (0..1), heading (radians), speed.
// GPUComputationRenderer adds the `uState` and `resolution` declarations.
export const updateShader = /* glsl */ `
uniform float uFrame;
uniform float uTime;
uniform vec2 uViewport;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uStep;
uniform vec3 uPointer;
uniform float uPointerRadius;

${simplexNoise3D}
${lifeCycle}

void main() {
  uvec2 cell = uvec2(gl_FragCoord.xy);
  vec4 state = texelFetch(uState, ivec2(cell), 0);
  Cycle c = lifeCycle(cell, uFrame);

  if (!c.started) {
    gl_FragColor = state;
    return;
  }

  if (c.age == 0.0) {
    float angle = unitRandom(c.seed) * TAU;
    vec2 spawn = uCenter + uRadius * vec2(cos(angle), sin(angle));
    float heading = unitRandom(c.seed + 1u) * TAU;
    float speed = unitRandom(c.seed + 2u) * 4.0;
    gl_FragColor = vec4(spawn / uViewport, heading, speed);
    return;
  }

  vec2 position = state.xy * uViewport;
  float heading = state.z;
  float speed = state.w;

  // Drift with a slowly changing noise flow field.
  float flow = snoise(vec3(position * 0.001, uTime * 0.1));
  heading = mix(heading, flow * TAU, 0.01);

  // Swirl around the pointer, fading with distance.
  vec2 away = position - uPointer.xy;
  float dist = length(away);
  float pull = uPointer.z * (1.0 - smoothstep(0.0, uPointerRadius, dist));
  if (pull > 0.0) {
    vec2 outward = away / max(dist, 1.0);
    vec2 swirl = vec2(-outward.y, outward.x) + 0.35 * outward;
    float target = atan(swirl.x, swirl.y);
    float turn = atan(sin(target - heading), cos(target - heading));
    heading += turn * pull * 0.3;
    speed += pull * 1.5;
  }

  speed = (speed + flow * 0.5 + 0.5) * 0.9;
  position += vec2(sin(heading), cos(heading)) * speed * uStep;

  gl_FragColor = vec4(position / uViewport, heading, speed);
}
`;

export const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const ATLAS_COLUMNS = 8;
const GLYPH_CELL_PX = 14;

export const drawVertexShader = /* glsl */ `
uniform sampler2D uState;
uniform float uFrame;
uniform vec2 uViewport;

varying float vFade;
varying vec2 vUv;

${lifeCycle}

void main() {
  int size = textureSize(uState, 0).x;
  uvec2 cell = uvec2(gl_InstanceID % size, gl_InstanceID / size);
  Cycle c = lifeCycle(cell, uFrame);
  vFade = c.started ? 1.0 - c.age / c.life : 0.0;

  if (vFade <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }

  // Each spawn picks a new letter. Only the middle 60% of the cell width is
  // drawn; monospaced letters fit there. The atlas texture is flipped in y.
  uint glyph = hash(c.seed + 7u) % ${GLYPHS.length}u;
  vec2 atlasCell = vec2(float(glyph % ${ATLAS_COLUMNS}u), float(glyph / ${ATLAS_COLUMNS}u));
  vec2 local = position.xy * vec2(0.6, 1.0);
  vUv = (vec2(atlasCell.x, ${ATLAS_COLUMNS}.0 - atlasCell.y - 1.0) + local + 0.5)
    / ${ATLAS_COLUMNS}.0;

  // Letters read along their heading. Screen y grows downward.
  vec4 state = texelFetch(uState, ivec2(cell), 0);
  vec2 forward = vec2(sin(state.z), cos(state.z));
  vec2 up = vec2(forward.y, -forward.x);
  vec2 pixel = state.xy * uViewport
    + (forward * local.x + up * local.y) * ${GLYPH_CELL_PX}.0;
  vec2 clip = pixel / uViewport * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

// Premultiplied. Dark theme: gray letters add up. Light theme: black letters
// with max blending, so overlaps never get darker than one letter.
export const drawFragmentShader = /* glsl */ `
uniform sampler2D uAtlas;
uniform float uGain;
uniform float uLight;

varying float vFade;
varying vec2 vUv;

void main() {
  float v = texture2D(uAtlas, vUv).a * vFade * uGain;
  gl_FragColor = vec4(vec3(v * uLight), v);
}
`;
