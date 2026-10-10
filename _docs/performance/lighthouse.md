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

| Page | Mobile  | Desktop   | Mobile LCP  | Mobile CLS    |
| ---- | ------- | --------- | ----------- | ------------- |
| /en  | 99 → 98 | 100 → 100 | 1.9 → 2.3 s | 0.002 → 0.002 |
| /es  | 99 → 98 | 100 → 100 | 1.9 → 2.2 s | 0 → 0.002     |

- The LCP element did not change: the hero summary, or the subtitle on /es mobile.
- The home HTML grew from 23 to 40 KB gzipped, mostly from the added tool icons. Each icon's SVG path is sent twice: in the HTML and in the data React uses to start the page.
- PageSpeed Insights after the branch went live (mobile, three runs each): /en scored 87, 100 and 100 (LCP 3.1, 1.5 and 1.1 s), with Best Practices 96 in all three because `use.typekit.net` requests timed out. /es scored 89, 89 and 90 (FCP 2.6 to 2.7 s, LCP 3.2 s), with Best Practices 100. Desktop scored 100 in every category. The slow mobile runs were the ones where Adobe Fonts loaded; the next section explains why.

## Branch `perf/page-weight-fonts` (2026-10-09)

**Why the first paint waited for Adobe Fonts on PSI.** Lighthouse estimates mobile timing from a fast, unthrottled load. Any request at top priority that finished before that load's first paint counts as render-blocking, and font files are always top priority. When the kit answered quickly, its CSS, `p.css`, and the font were replayed at mobile speed before the first paint: FCP 2.3 s locally, 2.6 s on PSI. When the kit timed out, they were skipped, and FCP was under 1 s. The preload and the preconnects were not the cause: without them, FCP stayed at 2.30 and 2.32 s. A real throttled browser painted at 1.9 s, before the font arrived at 3.3 s.

| Change                                                                         | Effect                                                                                                                                                          |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adobe Fonts stylesheet added after the first contentful paint, with no preload | Local mobile FCP 1.57 → 1.07 s. On a slow phone the fallback font shows about 0.9 s longer (one throttled trace).                                               |
| Each card icon is its own `.tsx` component, sent to the cards as a key         | /en HTML 41.1 → 27.8 KB and /es 41.9 → 28.9 KB gzipped. Before, each path was in the HTML and again in the hydration data. Home JS grew 11 KB gzipped (cached). |
| About photo `srcset`: 160, 256 and 400 px                                      | PSI's phone gets the 5.0 KiB file instead of 12.8 KiB; 1x desktop gets 2.6 KiB.                                                                                 |

Local, production build, median of 3, `main` → branch in one Chrome session. "PSI-like CPU" uses `--throttling.cpuSlowdownMultiplier=1.8` on this machine (benchmark index about 1,800); see below.

| Page | Mobile  | Mobile, PSI-like CPU | Desktop   | Mobile FCP    | Mobile LCP    | Mobile CLS |
| ---- | ------- | -------------------- | --------- | ------------- | ------------- | ---------- |
| /en  | 98 → 94 | 99 → 99              | 100 → 100 | 1.59 → 1.15 s | 1.92 → 1.89 s | 0 → 0      |
| /es  | 97 → 94 | 97 → 99              | 100 → 100 | 1.57 → 1.21 s | 1.92 → 1.88 s | 0 → 0.002  |

- At the default 4x CPU, Total Blocking Time rose from about 100 ms to 220 to 270 ms. The page does the same work, but the earlier paint moves the first layout task into the TBT window. At PSI-like CPU, TBT stayed at 12 to 16 ms.
- The LCP element did not change: the hero summary, or the subtitle on /es.
- If Adobe Fonts fails fast (`ERR_TIMED_OUT`), Chrome logs the error, and Best Practices drops on PSI. Page code can't prevent that. DevTools URL blocking logs nothing, so test this with a failed request instead (CDP `Fetch.failRequest`).

## How to re-measure

PageSpeed Insights is the reference: run https://pagespeed.web.dev on each page three times and compare medians.

Locally, on a production build in the container (`docker compose run --rm frontend sh -c "pnpm build"`, then `pnpm start` on port 3000):

- **GPU:** start Chrome with `--remote-debugging-port=9222` and a scratch `--user-data-dir`, then run `lighthouse http://localhost:3000/en --port=9222` from the container (devDependency, same version as PSI). Chrome only accepts `Host: localhost`, so forward 127.0.0.1:9222 inside the container to `host.docker.internal:9222`.
- **Software WebGL (close to PSI):** a throwaway image on top of the project image with `apk add chromium mesa-egl mesa-gles mesa-dri-gallium font-liberation font-roboto`, run with `--cpus=1`, and Lighthouse's `--chrome-flags="--headless=new --no-sandbox --use-gl=angle --use-angle=gl-egl --ignore-gpu-blocklist"`. Serve the site to it as `localhost`, or the HTTPS audits fail.

PSI throttles mobile CPU by 1.2x on a machine that benchmarks about 1,200; local runs use Lighthouse's default 4x, so local mobile scores in the software setup are harsher than PSI. To get close to PSI on a fast machine, pass `--throttling.cpuSlowdownMultiplier` equal to the run's `benchmarkIndex` divided by 1,000.
