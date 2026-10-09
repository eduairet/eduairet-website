# Lighthouse: eduairet-website

The site scored 27 to 64 in PageSpeed Insights because the particle background ran its WebGL loop on the CPU there, forever. It now starts on the first scroll, pointer or key input and never on software WebGL, pages paint without a fade, fonts no longer block the first paint, and reCAPTCHA loads on first use of the form.

## Baseline (2026-10-08, before branch `perf/lighthouse`)

PageSpeed Insights, production, Lighthouse 13.5.0, median of 3 (desktop: runs that finished).

| Page        | Mobile | Desktop              | A11y | BP  | SEO | Mobile TBT | Mobile LCP |
| ----------- | ------ | -------------------- | ---- | --- | --- | ---------- | ---------- |
| /en         | 48     | 64 (1/3, 2 timeouts) | 100  | 100 | 100 | 20,750 ms  | 3.6 s      |
| /es         | 48     | 64 (1/3)             | 100  | 100 | 100 | 29,510 ms  | 3.5 s      |
| /en/contact | 27     | 62                   | 100  | 96  | 100 | 23,890 ms  | 8.7 s      |
| /es/contact | 27     | 63-64 (2/3)          | 100  | 96  | 100 | 30,040 ms  | 8.7 s      |

- 32 to 39 s of main-thread time in PSI belonged to the three.js chunk, with under 1 s of script: software WebGL kept the CPU busy, and desktop runs timed out (`RPC::DEADLINE_EXCEEDED`).
- reCAPTCHA (about 730 KiB) loaded with every contact page and logged `requestStorageAccess: Permission denied`.
- Lighthouse does not audit 404 responses (`ERRORED_DOCUMENT_REQUEST`), in PSI or locally.

## Decisions and their measured effect

Local, production build, median of 3. "Software" is the PSI-like setup below.

| Change                                                                                                                                     | Effect                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Particles start on first input; off on software WebGL (`failIfMajorPerformanceCaveat` or a SwiftShader, llvmpipe or WARP renderer)         | Software /en: mobile 38 → 45, desktop 52 → 91                                                                                      |
| reCAPTCHA loads on first focus of the form                                                                                                 | /en/contact software: 39 → 48 mobile, 85 → 90 desktop; GPU 86 → 89, 97 → 100                                                       |
| Theme set by an inline script before the first paint                                                                                       | Light-theme visitors no longer see the dark theme first; 22 color transitions at load → 0; software mobile Speed Index 6.5 → 4.8 s |
| Size-matched fallback faces for Degular (Arial and clones, Roboto, Open Sans, DejaVu), scaled per weight with Degular's ascent and descent | Line breaks match Degular at 14 widths, 320 to 1920 px; font-swap CLS 0.13 → under 0.01                                            |
| No page fade-in (needs the fallback above)                                                                                                 | Content paints on the first frame; LCP no longer waits for hydration                                                               |
| framer-motion removed; cards, theme bulb and menu icon reproduce its timing in CSS and a small tween                                       | 39 KiB less gzipped JS on every page; animations match frame by frame                                                              |
| Adobe Fonts CSS added by a script (preload plus noscript fallback)                                                                         | GPU /en mobile 91 → 99 (FCP 2.6 → 1.6 s)                                                                                           |
| Only the current locale's UI strings reach the client                                                                                      | Both dictionaries out of the client bundle                                                                                         |

Tried and dropped: starting the particles after a delay (scored like "off" only because Lighthouse stops measuring first), and pacing the particle loop with a timer (halved its speed under CPU throttling).

## After deploy (PageSpeed Insights, production, 2026-10-08)

Lighthouse 13.5.0, median of 3, 10:38 to 11:01 PM CST, after PR #33 went live.

| Page        | Mobile   | Desktop  | Mobile TBT     | Mobile LCP  | A11y | BP       | SEO |
| ----------- | -------- | -------- | -------------- | ----------- | ---- | -------- | --- |
| /en         | 48 → 94  | 64 → 100 | 20,750 → 40 ms | 3.6 → 2.4 s | 100  | 100      | 100 |
| /es         | 48 → 90  | 64 → 100 | 29,510 → 40 ms | 3.5 → 3.0 s | 100  | 100      | 100 |
| /en/contact | 27 → 96  | 62 → 100 | 23,890 → 30 ms | 8.7 → 2.3 s | 100  | 96 → 100 | 100 |
| /es/contact | 27 → 100 | 63 → 100 | 30,040 → 20 ms | 8.7 → 1.4 s | 100  | 96 → 100 | 100 |

All 12 desktop runs finished (5 had timed out or failed before). Mobile varies by a few points between runs (/en: 94, 90, 100).

## Final (local, production build, 2026-10-08)

Median of 3, before → after. GPU: host Chrome 154 with an RTX 4060. Software: Linux headless Chromium, llvmpipe WebGL, one CPU.

| Page        | Software mobile | Software desktop | GPU mobile | GPU desktop |
| ----------- | --------------- | ---------------- | ---------- | ----------- |
| /en         | 38 → 71         | 52 → 97          | 90 → 95    | 98 → 100    |
| /es         | 37 → 69         | 49 → 98          | 83 → 95    | 99 → 100    |
| /en/contact | 32 → 75         | 61 → 97          | 82 → 97    | 99 → 100    |
| /es/contact | 31 → 77         | 53 → 97          | 83 → 97    | 99 → 100    |

All pages: Accessibility, Best Practices and SEO 100; axe 0 violations in both themes with menus open and closed.

## After branch `feat/ui-polish` (local, production build, 2026-10-09)

GPU setup below, median of 3, `main` → branch, both measured in one Chrome session after the branch's last change.

| Page | Mobile  | Desktop   | Mobile LCP  | Mobile CLS |
| ---- | ------- | --------- | ----------- | ---------- |
| /en  | 99 → 99 | 100 → 100 | 1.8 → 1.9 s | 0.002 → 0  |
| /es  | 95 → 99 | 100 → 100 | 2.5 → 1.9 s | 0 → 0.008  |

- The LCP element did not change: the hero summary, or the subtitle on /es mobile.
- Mobile scores vary by run (`main` /es mobile: 99, 84, 95).
- /es mobile CLS was 0.008 in all three branch runs, from the fixed footer. It stays under 0.01. In Chrome at the same size and throttling, the branch shows no layout shift, so the cause is still open.

## How to re-measure

PageSpeed Insights is the reference: run https://pagespeed.web.dev on each page three times and compare medians.

Locally, on a production build in the container (`docker compose run --rm frontend sh -c "pnpm build"`, then `pnpm start` on port 3000):

- **GPU:** start Chrome with `--remote-debugging-port=9222` and a scratch `--user-data-dir`, then run `lighthouse http://localhost:3000/en --port=9222` from the container (devDependency, same version as PSI). Chrome only accepts `Host: localhost`, so forward 127.0.0.1:9222 inside the container to `host.docker.internal:9222`.
- **Software WebGL (close to PSI):** a throwaway image on top of the project image with `apk add chromium mesa-egl mesa-gles mesa-dri-gallium font-liberation font-roboto`, run with `--cpus=1`, and Lighthouse's `--chrome-flags="--headless=new --no-sandbox --use-gl=angle --use-angle=gl-egl --ignore-gpu-blocklist"`. Serve the site to it as `localhost`, or the HTTPS audits fail.

PSI throttles mobile CPU by 1.2x on a machine that benchmarks about 1,200; local runs use Lighthouse's default 4x, so local mobile scores in the software setup are harsher than PSI.
