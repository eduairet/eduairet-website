# WCAG 2.2 AA

Last verified: 2026-10-18.

The site meets WCAG 2.2 Levels A and AA on the checks below, with three exceptions. 2.2.2 Pause, Stop, Hide is an accepted deviation (F-23). 1.2.2 Captions (Prerecorded) is open (F-24). 2.4.2 Page Titled fails on file-like unknown URLs (F-15). 4.1.1 Parsing is obsolete in WCAG 2.2 and is not evaluated.

## Scope and method

Production server: `pnpm build`, then `pnpm start --port 3000`. Next.js 16.4.0. React 19.3.0. The test run used that build.

axe-core 4.11.0 through `@axe-core/playwright` 4.11.0 and Playwright 1.56.1. Browser: Google Chrome 154.0.8037.92 at `/usr/local/bin/google-chrome`, with `--no-sandbox` and `--disable-dev-shm-usage`. Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.

Routes, each in `en` and `es`: `/`, `/contact`, `/privacy`, `/projects`, the 12 slugs in `PROJECTS` (`src/utils/constants/projects.constants.ts`), and `/does-not-exist`. Themes: dark and light. The theme is `localStorage` key `theme` plus `colorScheme` emulation. Viewports: 375 by 812, and 1280 by 900. Menus stayed closed.

That is 17 paths, 2 locales, 2 themes, and 2 widths, so 136 runs. `rg -c "slug: '" src/utils/constants/projects.constants.ts` prints 12. Adding home, contact, privacy, projects, and the unknown path makes 17.

Keyboard: Playwright presses Tab on `/en`, `/es`, `/en/contact`, `/es/contact`, `/en/projects/collectible-pleasures`, and `/es/projects/collectible-pleasures`. Viewports: 375 by 667, 1280 by 900, 320 by 568, and 1280 by 480. `prefers-reduced-motion: reduce` is on. Each element counts once, so two links with the same name are two stops. A stop inside `footer` is not counted as covered by the footer. The test run walked forward only.

Layout: the same Playwright session reads `footer` position, `--footer-clearance`, and the All projects link (`main a[href="/<locale>/projects"]` on `/projects/eduardo-pavon`).

Contrast ratios in this report are the sRGB relative luminance of the tokens in `src/styles/abstracts/variables/_colors.scss`. The test run computed them from the tokens.

## Results

axe-core 4.11.0 reported 0 violations in 136 runs. Home and `/projects/collectible-pleasures`, in `en` and `es`, dark and light, at 375 by 812 and 1280 by 900, reported 0 violations in 16 runs.

The Tab walk took 744 stops across 24 pages and left 0 hidden or fully under the fixed footer.

`footer` is `static` when the width is under 768 or the height is 500 or less. It is `fixed` from 768 wide with height over 500. Checked on home and `/projects/collectible-pleasures`, in `en` and `es`, at 375 by 667, 390 by 844, 767 by 800, and 1280 by 480 (static), and on home at 1280 by 800 and 768 by 800 (fixed). All 20 cases matched. On the fixed cases `--footer-height` is `82px` and `--footer-clearance` is `calc(82px + 1rem)`. On the static cases the clearance is `1rem`.

`/en` has 0 horizontal overflow at 320 by 450, 320 by 256, 375 by 667, and 1280 by 900.

At 375 by 667 with reduced motion, `/en/privacy` is 6530px tall and `/es/privacy` is 7031px tall.

The All projects link is `sticky` at `top: 35px` and `z-index: 3`. Above 500px tall its top margin is `-85px`, so on load the link is already at that top and the meta line starts under the header. It stays at 35px while the page scrolls. It is `flex-start` under 768px wide and `center` from 768px up. At 500px tall or shorter it is `static` and the top margin is `0`. At 501px tall it is `sticky` with the `-85px` margin. On `/projects/collectible-pleasures` at 320px wide in Spanish, the link ends 7px before the menu pill. The open phone menu is `z-index: 6` and covers the link. The footer on those phone widths is `static`. At 1280 by 900 the footer is `fixed`.

## Layout rules in the SCSS

Breakpoints in `src/styles/abstracts/variables/_breakpoints.scss`: `$breakpoint-md` is 768px. `$breakpoint-short-height` is 500px.

`footer-static` in `src/styles/abstracts/_mixins.scss` matches `width < 768px` or `height <= 500px`. `footer-row` matches `width >= 768px`.

`%docked-pill` in `src/styles/abstracts/_placeholders.scss` is `sticky` at `top: $docked-pill-top` on `$z-docked`. `$docked-pill-top` in `src/styles/abstracts/variables/_sizes.scss` is `calc((#{$header-height} - #{$pill-height}) / 2)`, which is 35px. `$header-height` is 120px and `$pill-height` is 50px. The placeholder aligns to the start under 768px and to the center from 768px up. At a height of 500px or less it is `static`. Section titles and the All projects link use this placeholder. The All projects link, in `src/app/[locale]/projects/[slug]/project.module.scss`, also sets `margin-top: calc(#{$docked-pill-top} - #{$header-height})`, which is `-85px`, when the height is over 500px. That is the sticky top minus the header, so the link's flow position is the dock before any scroll. Section titles use `$docked-pill-top` as `top`.

Stack in `src/styles/abstracts/variables/_z-index.scss`, back to front: background -1, backdrop 1, header 2, docked 3, footer 4, toast 5, menu 6, skip link 7.

`--footer-clearance` in `src/styles/_global.scss` is `calc(var(--footer-height, estimate) + 1rem)` when the footer is fixed. `footer-static` sets it to `1rem`. `MeasuredFooter` writes `--footer-height` from the footer border box.

`PHONE_QUERY` in `src/utils/constants/layout.constants.ts` is `max-width: 767.98px`. Below that width the main menu is a modal dialog (`role="dialog"`, `aria-modal`) while it is open. Focus wraps, and Escape, a chosen link, or the menu button closes it.

## Findings

### F-01 Reduced motion left the cards invisible

- Criterion: 1.4.3 Contrast (Minimum) (AA), and 2.4.7 Focus Visible (AA)
- Severity: Critical
- Status: Fixed
- Where: `useReveal` (`src/components/wrappers/RevealOnScroll/useReveal.ts`) and `RevealOnScroll.module.scss`
- Now: a card starts at `opacity: 0` and `translateY(30px)`, then `.inView` sets `opacity: 1` and clears the transform. The observer threshold is `0.3`. A block that leaves through the bottom loses `.inView`. A block whose top is already above the viewport keeps `.inView`, so the 30px offset cannot pull it back across the threshold. Under `prefers-reduced-motion: reduce` the transform transition is dropped and the fade remains. Under `scripting: none` the card is opaque at once.

### F-02 The contact token was requested on load

- Criterion: 2.2.1 Timing Adjustable (A), and 3.3.1 Error Identification (A)
- Severity: Critical
- Status: Fixed
- Where: `getRecaptchaToken` in `src/hooks/useRecaptcha.ts`, called from `handleSubmit` in `ContactForm.tsx`
- Now: the token is requested at submit, not on load. The test run did not wait more than two minutes before submit. That needs a real reCAPTCHA send.

### F-03 Red text on light backgrounds was under 4.5:1

- Criterion: 1.4.3 Contrast (Minimum) (AA)
- Severity: Serious
- Status: Fixed
- Where: `--accent-text` in `src/styles/_global.scss`, and `$accent-on-light` in `_colors.scss`
- Now: dark text red is `#f00` (5.25:1 on `#000`). Light text red is `#d40000` (4.72:1 on `#ededed`). `#f00` on `#ededed` is 3.42:1 and is not used for small text. The large red subtitle can use the 3:1 large-text bar. The test run did not sample pixels on the page.

### F-04 Field focus was a mint border on light backgrounds

- Criterion: 1.4.11 Non-text Contrast (AA), and 2.4.7 Focus Visible (AA)
- Severity: Serious
- Status: Fixed
- Where: field focus styles in `TextInput.module.scss`
- Now: focus reads as a thicker border. The valid color is `#00ffc3` in the dark theme (16.09:1 on `#000`) and `#008566` in the light theme (3.95:1 on `#ededed`). `#00ffc3` on `#ededed` is 1.11:1, so the light theme does not use it for the ring. An invalid field uses the red border, and the error text plus `aria-invalid` carry the error. The shared `accessibility-outline` mixin is a 3px `#f00` outline with a 3px offset (3.42:1 on `#ededed`, 5.25:1 on `#000`).

### F-05 Closed menus stayed in the tab order

- Criterion: 2.4.3 Focus Order (A), 2.4.7 Focus Visible (AA), and 4.1.2 Name, Role, Value (A)
- Severity: Serious
- Status: Fixed
- Where: `useNavMenu`, `NavDropdown`, `NavMainMenu`
- Now: a closed list uses `visibility: hidden` after the close animation. Toggles expose `aria-expanded` and `aria-controls`. Escape and a focus move outside the menu close it and return focus to the toggle. Below 768px the open main menu is a modal dialog.

### F-06 Focus sat under the fixed footer

- Criterion: 2.4.11 Focus Not Obscured (Minimum) (AA)
- Severity: Serious
- Status: Fixed
- Where: `footer-static`, `--footer-clearance`, `scroll-padding-bottom` in `_global.scss`
- Now: under 768px wide, and at 500px tall or shorter, the footer is in the page flow, so a focused item cannot sit under it. From 768px up, with more than 500px of height, the footer stays fixed and the clearance follows `--footer-height`. The Tab walk in Results left 0 stops fully under that footer.

### F-07 Errors were not tied to fields

- Criterion: 3.3.1 Error Identification (A), and 1.3.1 Info and Relationships (A)
- Severity: Serious
- Status: Fixed
- Where: `TextInput.tsx`, `useTextInput.ts`, `ContactForm.tsx`
- Now: Submit stays enabled. A submit with errors shows each error and focuses the first invalid field. Invalid fields set `aria-invalid` and `aria-describedby`. Validity uses the new value.

### F-08 Error text did not say how to fix the input

- Criterion: 3.3.3 Error Suggestion (AA), and 3.3.2 Labels or Instructions (A)
- Severity: Serious
- Status: Fixed
- Where: `src/utils/constants/form.constants.ts`, client and server form utils, both dictionaries
- Now: messages say what to change, in English and in Spanish. Messages accept line breaks. Names accept apostrophes and hyphens. Emails accept `+` and long top-level domains. Client and server share the rules.

### F-09 Sending and the result were silent

- Criterion: 4.1.3 Status Messages (AA), 4.1.2 Name, Role, Value (A), and 2.4.3 Focus Order (A)
- Severity: Serious
- Status: Fixed
- Where: `FormWrapper.tsx`, `Spinner.tsx`, the toast
- Now: the form status region holds errors. Success shows in a toast with its own `role="status"`, no timer, and a close button of at least 24px. While sending, the button uses `aria-disabled` and a named spinner. Focus stays on the button.

### F-10 The home subtitle dropped its spaces

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Moderate
- Status: Fixed
- Where: `HomeSubtitle.tsx`
- Now: a real space is rendered between word spans. The flex gap sets the look.

### F-11 Name and email had no autocomplete

- Criterion: 1.3.5 Identify Input Purpose (AA)
- Severity: Moderate
- Status: Fixed
- Where: the name and email fields in `ContactForm.tsx`
- Now: `autocomplete="name"` and `autocomplete="email"`.

### F-12 Links in cards matched the text beside them

- Criterion: 1.4.1 Use of Color (A)
- Severity: Moderate
- Status: Fixed
- Where: links inside cards, `_global.scss`
- Now: links in cards have a 1px underline.

### F-13 The success message cleared itself

- Criterion: 2.2.1 Timing Adjustable (A)
- Severity: Moderate
- Status: Fixed
- Where: the contact toast
- Now: the toast has no timer. It closes from its button, from Escape, or when the visitor types in a field.

### F-14 The scroll cue bounced without stopping

- Criterion: 2.2.2 Pause, Stop, Hide (A)
- Severity: Moderate
- Status: Fixed
- Where: `ScrollCue.module.scss`
- Now: `animation: scroll-bounce 1.6s ease-in-out 3`, so it runs for 4.8 seconds. Reduced motion sets the animation to none.

### F-15 Some 404 titles do not say the page is missing

- Criterion: 2.4.2 Page Titled (A)
- Severity: Moderate
- Status: Open
- Where: `src/app/global-not-found.tsx`, `src/app/[locale]/not-found.tsx`, `PUBLIC_FILE` in `src/proxy.ts`
- Now: `/en/does-not-exist`, `/es/does-not-exist`, `/en/projects/not-a-real-slug`, `/es/projects/not-a-real-slug`, `/en/contact/extra`, `/.well-known/test`, and `/api/nope` return HTTP 404 with `noindex` and render `global-not-found.tsx`. The title is `Page not found | Eduardo Aire Torres`. The `h1` is `404 - Page not found`. A Spanish line, `404 - Página no encontrada`, has `lang="es"`. `html` `lang` is `en`. `/en` at 200 has one `main` and one `h1`.
- `/wp-login.php` and `/not-a-page.html` return HTTP 404 with `noindex` and the Next default shell (`html id="__next_error__"`). The title is `Eduardo Aire Torres`. The response contains `This page could not be found.` Those titles do not name the 404.
- `[locale]/not-found.tsx` hoists a localized title. The unknown routes above did not render it. They rendered `global-not-found.tsx`.
- `/fr` returns 302 to `/en/fr` with `Vary: Accept-Language`. `/en/fr` is the global 404 above.

### F-16 Spanish pages exposed English names

- Criterion: 3.1.2 Language of Parts (AA)
- Severity: Moderate
- Status: Fixed
- Where: dictionaries `en.json` and `es.json`
- Now: interface strings come from the dictionary for the page locale. Brand names stay as written. The test run did not include a screen reader.

### F-17 Required fields were marked only with an asterisk

- Criterion: 3.3.2 Labels or Instructions (A)
- Severity: Moderate
- Status: Fixed
- Where: `ContactForm.tsx`
- Now: every field is required, and the asterisks are gone. One line above the fields asks the visitor to fill them in. Hints state the length in words and are linked with `aria-describedby`. Native `required` exposes the state. The privacy checkbox is required, and its error is tied to it.

### F-18 The theme button hid its state

- Criterion: 4.1.2 Name, Role, Value (A)
- Severity: Moderate
- Status: Fixed
- Where: `ThemeButton.tsx`, `Footer.tsx`
- Now: the theme button name says which theme it will switch to, and it updates after the toggle. The footer paragraph has no `aria-label`. Control names do not repeat the role.

### F-19 The loading fallback duplicated the page

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Minor
- Status: Fixed
- Where: page HTML
- Now: pages are prerendered. The raw HTML of `/en` has one `main` and one `h1`.

### F-20 Language links used short abbreviations

- Criterion: 2.4.4 Link Purpose (In Context) (A)
- Severity: Minor
- Status: Fixed
- Where: `NavLangLinks`
- Now: the links read `English` and `Español`, with `lang` and `hreflang`. The active one has `aria-current="page"`.

### F-21 The home title is split into spans

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Needs review
- Status: Not checked
- Where: `HomeTitle.tsx`
- The `h1` is built from inline spans. The test run did not include a screen reader.

### F-22 Resources was a page with no link to it

- Criterion: 2.4.5 Multiple Ways (AA)
- Severity: Needs review
- Status: Fixed
- Where: `next.config.mjs` redirects
- Now: this site has no resources page. `/resources`, `/en/resources`, and `/es/resources` return 308 to `https://archive.eduairet.com/resources`. Home, Projects, and Contact are in the nav on every page.

### F-23 Motion has no pause control

- Criterion: 2.2.2 Pause, Stop, Hide (A)
- Severity: Moderate
- Status: Accepted deviation
- Where: `ParticleBackground`, `CardShapes`, `AboutVideo`, `ProjectMedia` clips, and the live pieces `torus`, `waves`, `letrastica`, and `ascii` in `projects.constants.ts`
- The particle field, the card wireframes, the About video, the muted clips, and the four live pieces run with no pause control on the page. That does not meet 2.2.2. The deviation is accepted. To meet 2.2.2, add a pause control that stops all of them and stores the choice.
- What the code does instead:
  - Particles start from `whenVisitorActive` in `startGate.ts`, and only when `hasHardwareWebGL()` is true. The canvas opacity is 0.2 (`ParticleBackground.module.scss`). The canvas is `aria-hidden`.
  - Card shapes turn once every 24 seconds (`TURN_SECONDS` in `shapeRuntime.ts`). Behind text, opacity is 0.15 (`BEHIND_OPACITY`). The canvases are `aria-hidden`. With reduced motion, or without hardware WebGL, a shape is drawn once.
  - The About video is muted, looped, and unnamed on the element. The wrapper is `role="img"` with the site name. It plays only after the first visitor input, while on screen, and not under reduced motion. Otherwise the still shows. The file is video only (h264, 5.541667 seconds, `ffprobe` on `public/eduardo-aire-torres.mp4`).
  - Project clips are muted, looped, and played while on screen. With reduced motion they hold still.
- The test run did not sample pixel luminance. The opacity values above are from source.

### F-24 The demo video has audio and no captions

- Criterion: 1.2.2 Captions (Prerecorded) (A)
- Severity: Serious
- Status: Open
- Where: `ProjectMedia.tsx` when `demo: true`, file `public/projects/interplanetary-fonts/clip-demo.mp4`
- `ffprobe` reports h264 video and aac audio, duration 193.252 seconds. The player has `controls`, `playsInline`, and `preload="none"`. It is not muted, it does not autoplay, and it has no `track`. `find public -name '*.vtt' | wc -l` prints 0. The test run did not check a text alternative beyond those file facts.

## Criteria

| Criterion                                                  | Level | Result         | Notes                                                                                                                           |
| ---------------------------------------------------------- | ----- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content                                     | A     | Pass           | F-09 fixed. Decorative canvases are `aria-hidden`.                                                                              |
| 1.2.1 Audio-only and Video-only (Prerecorded)              | A     | Not checked    | F-24. The demo has both streams. A text alternative was not checked.                                                            |
| 1.2.2 Captions (Prerecorded)                               | A     | Fail           | F-24 open.                                                                                                                      |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A     | Not checked    | No WebVTT file in `public`. A page-level alternative was not checked.                                                           |
| 1.2.4 Captions (Live)                                      | AA    | Does not apply | No live media.                                                                                                                  |
| 1.2.5 Audio Description (Prerecorded)                      | AA    | Not checked    | Same limit as 1.2.3.                                                                                                            |
| 1.3.1 Info and Relationships                               | A     | Pass           | F-07, F-10, and F-19 fixed. F-21 has no screen reader result.                                                                   |
| 1.3.2 Meaningful Sequence                                  | A     | Pass           | DOM order matches the visual order on the checked pages.                                                                        |
| 1.3.3 Sensory Characteristics                              | A     | Pass           | Instructions do not rely on shape or position alone.                                                                            |
| 1.3.4 Orientation                                          | AA    | Pass           | No orientation lock in the layout.                                                                                              |
| 1.3.5 Identify Input Purpose                               | AA    | Pass           | F-11 fixed.                                                                                                                     |
| 1.4.1 Use of Color                                         | A     | Pass           | F-12 fixed. Invalid fields also expose text and `aria-invalid`.                                                                 |
| 1.4.2 Audio Control                                        | A     | Pass           | No element autoplays. Clips and the About video are muted. The demo waits for its controls.                                     |
| 1.4.3 Contrast (Minimum)                                   | AA    | Pass           | F-03 fixed. Ratios are from the color tokens. The test run did not sample pixels behind the particles.                          |
| 1.4.4 Resize Text                                          | AA    | Not checked    | The test run did not resize text to 200 percent.                                                                                |
| 1.4.5 Images of Text                                       | AA    | Pass           | The logo is the image of text.                                                                                                  |
| 1.4.10 Reflow                                              | AA    | Pass           | `/en` has 0 horizontal overflow at 320px wide.                                                                                  |
| 1.4.11 Non-text Contrast                                   | AA    | Pass           | F-04 fixed. Token ratios are above 3:1 for the field rings in use.                                                              |
| 1.4.12 Text Spacing                                        | AA    | Not checked    | The test run did not apply the text-spacing override.                                                                           |
| 1.4.13 Content on Hover or Focus                           | AA    | Pass           | Extra content on hover is the native tooltip on tech icons.                                                                     |
| 2.1.1 Keyboard                                             | A     | Pass           | The Tab walk reached the controls. Menu, form, and dialog behavior is covered by unit tests.                                    |
| 2.1.2 No Keyboard Trap                                     | A     | Pass           | Forward Tab returned to the start on each walked page.                                                                          |
| 2.1.4 Character Key Shortcuts                              | A     | Does not apply | No character shortcuts.                                                                                                         |
| 2.2.1 Timing Adjustable                                    | A     | Pass           | F-02 and F-13 fixed. The test run did not wait two minutes before submit.                                                       |
| 2.2.2 Pause, Stop, Hide                                    | A     | Fail           | F-14 fixed. F-23 is an accepted deviation.                                                                                      |
| 2.3.1 Three Flashes or Below Threshold                     | A     | Not checked    | No flash was observed in the checks. The test run did not measure luminance.                                                    |
| 2.4.1 Bypass Blocks                                        | A     | Pass           | Landmarks, plus a skip link.                                                                                                    |
| 2.4.2 Page Titled                                          | A     | Fail           | F-15 open for file-like unknown URLs. The other checked titles name the page.                                                   |
| 2.4.3 Focus Order                                          | A     | Pass           | F-05 and F-09 fixed.                                                                                                            |
| 2.4.4 Link Purpose (In Context)                            | A     | Pass           | F-20 fixed. The home projects link reads `See all projects` in English and `Ver todos los proyectos` in Spanish.                |
| 2.4.5 Multiple Ways                                        | AA    | Pass           | F-22 fixed. Home, Projects, and Contact are in the nav.                                                                         |
| 2.4.6 Headings and Labels                                  | AA    | Pass           | Headings and labels describe their content on the checked pages.                                                                |
| 2.4.7 Focus Visible                                        | AA    | Pass           | F-01, F-04, and F-05 fixed. The Tab walk found 0 hidden stops.                                                                  |
| 2.4.11 Focus Not Obscured (Minimum)                        | AA    | Pass           | F-06 fixed. 744 stops, 0 fully under the fixed footer.                                                                          |
| 2.5.1 Pointer Gestures                                     | A     | Does not apply | No multipoint or path gesture.                                                                                                  |
| 2.5.2 Pointer Cancellation                                 | A     | Pass           | Actions run on click.                                                                                                           |
| 2.5.3 Label in Name                                        | A     | Pass           | Text controls include their visible label. Icon-only controls have no visible text label.                                       |
| 2.5.4 Motion Actuation                                     | A     | Does not apply | No motion input.                                                                                                                |
| 2.5.7 Dragging Movements                                   | AA    | Does not apply | No dragging.                                                                                                                    |
| 2.5.8 Target Size (Minimum)                                | AA    | Pass           | The toast close control is at least 24px. Inline text links are exempt.                                                         |
| 3.1.1 Language of Page                                     | A     | Pass           | `html lang` is `en` or `es` on locale pages. The global 404 uses `lang="en"`.                                                   |
| 3.1.2 Language of Parts                                    | AA    | Pass           | F-16 fixed. The Spanish line on the global 404 has `lang="es"`. The test run did not include a screen reader.                   |
| 3.2.1 On Focus                                             | A     | Pass           | Focus does not change the context by itself.                                                                                    |
| 3.2.2 On Input                                             | A     | Pass           | Inputs do not submit or navigate on their own.                                                                                  |
| 3.2.3 Consistent Navigation                                | AA    | Pass           | The same header and footer render on locale pages. The global 404 has no site footer.                                           |
| 3.2.4 Consistent Identification                            | AA    | Pass           | The same controls keep the same names.                                                                                          |
| 3.2.6 Consistent Help                                      | A     | Pass           | Contact is in the nav, and the email link is in the footer, on locale pages.                                                    |
| 3.3.1 Error Identification                                 | A     | Pass           | F-02 and F-07 fixed.                                                                                                            |
| 3.3.2 Labels or Instructions                               | A     | Pass           | F-08 and F-17 fixed.                                                                                                            |
| 3.3.3 Error Suggestion                                     | AA    | Pass           | F-08 fixed.                                                                                                                     |
| 3.3.4 Error Prevention (Legal, Financial, Data)            | AA    | Does not apply | The form does not make a legal, financial, or data-change commitment.                                                           |
| 3.3.7 Redundant Entry                                      | A     | Pass           | The form is one step. Values stay after an error.                                                                               |
| 3.3.8 Accessible Authentication (Minimum)                  | AA    | Does not apply | No sign-in. reCAPTCHA v3 shows no challenge.                                                                                    |
| 4.1.2 Name, Role, Value                                    | A     | Pass           | F-05, F-09, and F-18 fixed.                                                                                                     |
| 4.1.3 Status Messages                                      | AA    | Pass           | F-09 fixed.                                                                                                                     |

## Open items

- F-15. File-like unknown URLs use the Next default error shell. The title is the site name.
- F-23. Accepted deviation. Motion listed there has no pause control.
- F-24. The InterplanetaryFonts demo video has an audio stream and no captions track.
- F-21. Not checked. The test run did not include a screen reader.
- F-02. The test run did not wait two minutes before submit.

## Notes

- The shared focus outline is `#f00`, 3px, with a 3px offset. That is 3.42:1 on `#ededed`. It meets 1.4.11 and sits below the 2.4.13 AAA target.
- `#f00` on `#000` is 5.25:1. 1.4.6 AAA asks for 7:1 on normal text.
- At a height of 500px or less, the header, the footer, and docked pills leave the fixed layer. That is the short-screen rule in the SCSS above.
