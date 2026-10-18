# Lighthouse

Last verified: 2026-10-18.

## Scope and method

Lighthouse 13.5.0, the `lighthouse` devDependency. Three runs per target. The table uses the median.

Production server: `pnpm build`, then `pnpm start --port 3000`. Next.js 16.4.0. URLs:

- `http://127.0.0.1:3000/en`
- `http://127.0.0.1:3000/en/projects/collectible-pleasures`

Chrome 154.0.8037.92, headless, flags `--headless=new --no-sandbox --disable-dev-shm-usage`. Docker is not installed here. The run was on the host.

`NEXT_PUBLIC_TYPEKIT` was unset, so `loadTypekit` had an empty URL and no Adobe Fonts request was made. The HTML preconnects to `https://use.typekit.net` and `https://p.typekit.net` from `src/app/[locale]/layout.tsx`.

Mobile uses the Lighthouse default: `formFactor` mobile, `cpuSlowdownMultiplier` 4, screen 412 by 823, `deviceScaleFactor` 1.75, simulated Moto G Power (2022). Desktop uses `--preset=desktop`: `cpuSlowdownMultiplier` 1, screen 1350 by 940.

`environment.benchmarkIndex` across the 12 JSON reports ran from 3201.5 to 3905.5. Lighthouse bundles axe-core 4.13.0. That is a different run from the axe-core 4.11.0 audit in the accessibility report.

Repeat it with:

```bash
pnpm exec lighthouse http://127.0.0.1:3000/en \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --only-categories=performance,accessibility,best-practices,seo
pnpm exec lighthouse http://127.0.0.1:3000/en --preset=desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
  --only-categories=performance,accessibility,best-practices,seo
```

Use the same two commands with `http://127.0.0.1:3000/en/projects/collectible-pleasures`. Run each command three times and take the median.

The measured run is local Lighthouse, not PageSpeed Insights.

## Scores

| Page                                 | Form    | Performance | Accessibility | Best practices | SEO | FCP   | LCP   | TBT   | CLS |
| ------------------------------------ | ------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- | --- |
| `/en`                                | Mobile  | 99          | 100           | 100            | 92  | 1.1 s | 2.0 s | 30 ms | 0   |
| `/en`                                | Desktop | 100         | 100           | 100            | 92  | 0.3 s | 0.6 s | 0 ms  | 0   |
| `/en/projects/collectible-pleasures` | Mobile  | 99          | 100           | 100            | 100 | 1.1 s | 2.0 s | 20 ms | 0   |
| `/en/projects/collectible-pleasures` | Desktop | 100         | 100           | 100            | 100 | 0.3 s | 0.6 s | 0 ms  | 0   |

Home mobile Total Blocking Time was 40 ms, 30 ms, and 20 ms. The median is 30 ms. Home desktop Largest Contentful Paint was 0.6 s, 0.6 s, and 0.5 s. The median is 0.6 s. The project page mobile Total Blocking Time was 30 ms, 20 ms, and 20 ms. The median is 20 ms. Every other cell was the same in all three runs.

Home SEO is 92 because the `link-text` audit fails on one link. The href is `http://127.0.0.1:3000/en/projects` and the text is `See more`. The project page scores 100 on SEO.

## What the page does

Particles, card shapes, and the About video wait for `whenVisitorActive` in `src/components/art/startGate.ts`. The events are pointer move, pointer down, wheel, touch start, key down, and scroll. `hasHardwareWebGL` asks for `webgl2` with `failIfMajorPerformanceCaveat` and rejects a software renderer name (`SOFTWARE_RENDERER`).

`loadRecaptcha` in `src/hooks/useRecaptcha.ts` injects the reCAPTCHA script on first use, not with the contact page.

`loadTypekit` in `src/utils/constants/font.constants.ts` adds the Adobe Fonts stylesheet after `first-contentful-paint`. With an empty `NEXT_PUBLIC_TYPEKIT` it adds a stylesheet with an empty href. The measured run did not load a real kit.

Card shapes draw on a 2D canvas (`shapeRuntime.ts`). The page keeps the particle background as its WebGL scene. `TURN_SECONDS` is 24. `BEHIND_OPACITY` is 0.15. The particle canvas opacity is 0.2.

On viewports under 768px wide, or 500px tall or shorter, `--footer-clearance` is `1rem`. From 768px up, with height over 500px, the footer stays fixed and the clearance follows `--footer-height`. Measured values are in the accessibility report.

The All projects link and the section titles use `%docked-pill`.
