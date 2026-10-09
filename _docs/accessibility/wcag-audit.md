# WCAG 2.2 AA audit: eduairet-website

## 1. Summary

**Verdict before fixes (2026-10-05): Does not conform to WCAG 2.2 Level AA.**

**Verdict after fixes (2026-10-06): Conforms** to WCAG 2.2 Level AA on every criterion I could test in Chrome. No findings are open. F-21 was closed on code review, at your call; no screen reader was run. For F-22, `/resources` now returns 404 until it has content.

**Update (2026-10-06, branch `feat/particle-background`): one accepted deviation.** The new particle background has no pause control, so 2.2.2 Pause, Stop, Hide (Level A) is not met, and strictly the site no longer conforms. The site owner accepted this; see F-23 for the mitigations and the measured contrast. Every other criterion is unchanged.

**Update (2026-10-08, branch `feat/seo-audit`): no criterion changes.** The logo now fades into a photo on hover, keyboard focus, and press. The photo has `alt=""`, so the link is still named "Home", and with reduced motion it swaps without fading. reCAPTCHA now loads only on the contact page, and the page loading spinner is gone (see F-19).

**Update (2026-10-08, branch `perf/lighthouse`): no criterion changes.** The particle background now starts on the first scroll, pointer or key input and stays off with software WebGL; with reduced motion it still draws one still frame. Pages no longer fade in, the theme is set before the first paint, and the card, theme and menu animations moved from framer-motion to CSS with the same timing and the same reduced-motion behavior. axe: 0 violations on all pages and the 404, both themes, menus open and closed.

**Update (2026-10-09, branch `feat/ui-polish`): no criterion changes.**

- Section titles are sticky outlined pills. From 768px up they dock in the header; below that they sit under it, so the open menus stay on top.
- The photo moved from the logo to a new About section.
- The form asks for every field once, with no asterisks (F-17).
- Field focus is one ring in the border's color (F-04).
- A credit line closes every page. Its links are underlined and say they open in a new tab.
- Card tech icons wrap under the text. Tools with no usable logo are listed by name, at 7.69:1 contrast or more.
- On phones too short to fit it above the footer, the hero scroll arrow is hidden.
- Evidence: axe 4.11.0 found 0 violations in 48 runs (4 pages, both themes, menus closed and open, 1280 and 375 wide). A Tab walk forward and back on /en, /es and /en/contact at 4 sizes found no focus stop entirely hidden (772 stops). With reduced motion, nothing new moves.

Severity counts as found on 2026-10-05:

| Severity     | Count  |
| ------------ | ------ |
| Critical     | 2      |
| Serious      | 7      |
| Moderate     | 9      |
| Minor        | 2      |
| Needs review | 2      |
| **Total**    | **22** |

- **Date:** 2026-10-05
- **Standard:** WCAG 2.2 (W3C Recommendation, 12 December 2024 update), Levels A and AA. 4.1.1 Parsing is obsolete and not reported.
- **Build tested:** `main` at `1f61fd3`, dev server in Docker (`docker compose up -d`, http://localhost:3000). Next.js 16.3.6, React 19.3.0, framer-motion 13.4.4.
  - Note: the container was first running stale `node_modules` (Next 15.5.21, which ignores `src/proxy.ts`). I ran `pnpm install --frozen-lockfile` to match the committed lockfile before testing. No dependencies were added or changed.
- **Routes (all in `en` and `es`):** `/[locale]` home, `/[locale]/contact`, `/[locale]/resources`, 404 (`/[locale]/<anything>`). `/` and locale-less paths redirect (302) to a locale.
- **Themes:** dark (default) and light (`body[data-theme='light']`).
- **States:** both nav menus open and closed; contact form empty, invalid, valid, sending, success (mocked 200), error (mocked 500); reduced motion on and off; Suspense loading fallback.
- **Viewports:** 1280×900, 640×450 (200% zoom of 1280×900), 375×700, 320×568, 320×256 (400% zoom of 1280×1024).
- **Tools:**
  - axe-core 4.12.0 (from cdnjs), tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`, run in the Claude in-app browser (Chromium) on 8 pages × 6 states (dark, light, each menu open in each theme) = 48 runs.
  - Google Chrome 154.0.8037.98 headless, driven over the Chrome DevTools Protocol by small scripts. Used for keyboard (real `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, arrow key events), the full accessibility tree (`Accessibility.getFullAXTree`), `prefers-reduced-motion` emulation, viewport sizing, screenshots, and pixel-sampled contrast (text made transparent, then the background behind every text run sampled and compared with the computed text color).
  - The contact API was intercepted in tests, so no real email was sent. reCAPTCHA was stubbed with a fake token, because the site key does not run on localhost.
- **Not available:** Claude in Chrome (the extension was not connected), so no test used your real Chrome profile. No screen reader (NVDA, JAWS, VoiceOver) was run. Findings that depend on how a screen reader speaks are marked "Needs review".

**Verification after fixes (2026-10-06).** All 20 Critical, Serious, Moderate, and Minor findings are fixed; F-21 was closed on code review; F-22 was closed by unpublishing `/resources`.

- `npx tsc --noEmit`: pass.
- `pnpm lint`: pass.
- `pnpm test run`: 28 tests pass in 6 files. 27 are new, in `navMenu`, `contactForm`, `validation`, `themeAndText`, and `resources`.
- `npx prettier --check .`: on this Windows checkout (`core.autocrlf=true`) every file has CRLF endings, so the strict check flags files whether I touched them or not. With `--end-of-line auto`, only 3 files fail (`SECURITY.md`, `opengraph-image.tsx`, `models/types/form.ts`), the same 3 as before the fixes.
- axe-core 4.12.0 in headless Chrome: 0 violations in all 48 runs (8 pages × dark/light × menus closed/main open/language open).
- Repeated by hand in headless Chrome:
  - Tab walks
  - focus-obscured checks at 4 viewports
  - pixel contrast in both themes with menus open and errors showing
  - menu keyboard behavior
  - the full form flow (empty, invalid, typed, sending, success, error) in both languages
  - reduced motion
  - 320×256 reflow
  - the Spanish accessibility tree

**What changed visually or in behavior** (the smallest change that passes in each case):

- **Light theme:** red text is `#d40000` instead of `#f00`, as are the date labels on light cards. Dark theme reds are unchanged.
- **Form fields:** they show a focus ring (since 2026-10-09, in the border's color; see F-04).
- **Card links:** links inside cards have a thin underline.
- **Scroll chevron:** it bounces 3 times, then stops.
- **Menus:** Escape and moving focus away close them. The language links read "English"/"Español".
- **Contact form:**
  - Submit is always enabled.
  - One line above the fields asks for every field (since 2026-10-09; see F-17).
  - Hints read "3 to 100 characters".
  - Error messages are friendlier and say how to fix the input.
  - The reCAPTCHA notice sits under the button.
  - The pressed Submit button has black text.
- **Skip link:** a "Skip to content" link appears top-left on the first Tab.
- **Short screens:** on screens 500px tall or less, the header scrolls away, the footer sits at the end of the page, and section titles are not sticky.
- **404 page:** the heading reads "404 - Page not found" / "404 - Página no encontrada".

**What axe found vs. what manual testing found.** axe reported only 2 real problems: the active nav link contrast in light mode, and `aria-label` on a `<p>`. Every other finding below came from keyboard, accessibility tree, pixel, motion, and form testing. A clean axe run here would have been very misleading.

---

## 2. Findings

### F-01 With "reduce motion" turned on, all experience, project, and education cards are invisible

- Criterion: 1.4.3 Contrast (Minimum) (AA); also 2.4.7 Focus Visible (AA)
- Severity: Critical
- Where: `src/app/[locale]/components/HomeSection/SectionCard.tsx:15-27`; /en and /es, both themes, every viewport. Also affects production, because it is the same code.
- Evidence: with `prefers-reduced-motion: reduce` emulated, all 12 cards stay at `opacity: 0; transform: translateY(30px)` after load and after scrolling them into view with a real mouse wheel. The screenshot shows the "Experience" heading over an empty black page. The console shows a React hydration error: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up." The cause: on the server `useReducedMotion()` returns `null`, so the card is rendered with `initial` (opacity 0). On the client it returns `true`, so `motionProps` becomes `{}`, and nothing ever animates the card in. Text at opacity 0 has a 1:1 contrast ratio. The 14 links inside the cards still take keyboard focus while invisible.
- Who is affected: everyone who turned on "reduce motion" in their OS. Many of them have vestibular disorders, migraines, or attention disorders. They see the hero and then three empty sections, which is most of the site.
- Fix: keep the same motion props on server and client, and let framer-motion respect the setting. Wrap the app in `<MotionConfig reducedMotion="user">`, which turns off transform animations for these users and keeps the opacity fade, and pass the `initial`/`whileInView` props unconditionally in `SectionCard`. This also removes the page-enter slide for these users (see Nice to have, 2.3.3).
- Status: Fixed. `template.tsx` wraps pages in `<MotionConfig reducedMotion='user'>`, and `SectionCard` passes the same motion props on server and client. Evidence: headless Chrome with reduced motion emulated, after a real wheel scroll the cards in view are at opacity 1 with no slide, and the console has no hydration error.

### F-02 The contact form fails for anyone who takes more than two minutes, and retries never work

- Criterion: 2.2.1 Timing Adjustable (A); also 3.3.1 Error Identification (A)
- Severity: Critical
- Where: `src/hooks/useRecaptcha.ts:10-37`, `src/app/[locale]/contact/components/ContactForm/ContactForm.tsx:53,72-95`; /en/contact and /es/contact. The reCAPTCHA part is third party; the timing is ours.
- Evidence: `useRecaptcha` calls `grecaptcha.execute()` once, when the page mounts, and never again. Google's reCAPTCHA v3 docs say "reCAPTCHA tokens expire after two minutes" and "call `execute` when the user takes the action rather than on page load". Each token can also be verified only once. So: (1) if a person spends more than two minutes on the form, the server rejects the token and the user sees only "There was an error submitting the form"; (2) every retry sends the same used token and fails again; (3) the only way out is to reload the page, which loses what they typed. There is no warning and no way to extend the limit. The essential exception does not apply, because calling `execute()` at submit time removes the limit without changing the feature.
- Who is affected: people who type slowly or need breaks, such as screen reader users, switch and voice users, people with motor or cognitive disabilities, and people writing in a second language. They cannot contact you at all.
- Fix: call `grecaptcha.execute(siteKey, { action: 'submit' })` inside `handleSubmit`, right before the `fetch`, and stop gating the submit button on a token.
- Status: Fixed. `useRecaptcha` now returns `getRecaptchaToken()`, which `ContactForm` calls inside `handleSubmit`, and the button no longer waits for a token. Evidence: in Chrome with a stubbed `grecaptcha`, `execute` ran 0 times on load and once per submit. Unit test `contactForm.test.tsx` checks the token is fetched at submit. A real 2-minute expiry was not reproduced, because that needs a live send. A real send on the Vercel preview (2026-10-06) showed the new error message ("Something went wrong and your message wasn't sent…"), so the error path works, but the email was not sent. The cause is not confirmed: the reCAPTCHA key may not allow `*.vercel.app`, or the preview may lack the Gmail or reCAPTCHA environment variables. To do after deploy: send one real message in production, and wait more than two minutes before pressing Submit.

### F-03 Red text on light backgrounds is too faint

- Criterion: 1.4.3 Contrast (Minimum) (AA)
- Severity: Serious
- Where:
  - Active nav link in an open menu ("Home", "Contact", "ENG"/"SPN", "ING"/"ESP"): `src/components/ui/Nav/NavLink/NavLink.module.scss:8-12`, `src/styles/_global.scss:129-131`. Light theme, every page.
  - Card date labels (`.period`, 13px): `src/app/[locale]/components/HomeSection/HomeSection.module.scss:96-104`. Light-background cards (every second card), both themes, /en and /es.
  - Field error text, red label, and red length hint: `src/components/ui/TextInput/TextInput.module.scss:56-58` (hard-coded `color: red`). Light theme, /contact.
  - Form submit error message: `src/components/wrappers/FormWrapper/FormWrapper.module.scss:20-22`. Light theme, /contact.
  - Hover color of dropdown links (`NavDropdown.module.scss:34-36`). Light theme.
- Evidence: axe `color-contrast` on all 8 pages in light theme with a menu open: "#ff0000 on #ededed, 3.41". Pixel sampling of card dates: 3.38–3.42:1 ("May 2023 – Jan 2026", "Apr 2020 – Apr 2023", "2014 – Present", "Sep 2022 – Apr 2023", "2022 – 2023", "2019", and the /es versions). Error text computed `rgb(255,0,0)` on #ededed = 3.42:1. All of these are normal-size text and need 4.5:1. Red on black is 5.25:1 and passes, so dark-theme nav and errors are fine. The light-theme subtitle in red is large text (48px), so its 3.42:1 passes the 3:1 bar.
- Who is affected: people with low vision or color-vision differences, and anyone on a bright screen. The error messages are the text they most need to read.
- Fix (brand decision needed): add a text-accent token that stays `#f00` in dark mode and uses a darker red in light mode and on light cards. `#d40000` gives 4.72:1 on #ededed, the smallest change that passes. Replace the hard-coded `red` in `TextInput.module.scss` with the token.
- Status: Fixed. New `--accent-text` token: `#f00` in dark mode, `#d40000` in light mode (`_global.scss`), plus `$accent-on-light` for the dates on light cards. It is used for the active nav link, dropdown hover, field errors, labels and hints, the form error message, and the Submit hover text. The pressed Submit button now has black text on red (5.25:1). Evidence: axe 0 `color-contrast` violations in 48 runs; pixel sampling 0 failures on /en, /es and /en/contact in both themes with menus open and errors showing (lowest: error text 4.68:1, active link and card dates 4.72:1).

### F-04 Form field focus is almost invisible in light mode, and invisible on fields with errors

- Criterion: 1.4.11 Non-text Contrast (AA); also 2.4.7 Focus Visible (AA)
- Severity: Serious
- Where: `src/components/ui/TextInput/TextInput.module.scss:22-42`; /en/contact and /es/contact
- Evidence: `outline: none` is set, and focus only changes the border to #00ffc3. Against the light background #ededed that is 1.11:1 (needs 3:1). On a field that is already invalid, the `.invalid` red border wins, so a focused invalid field looks exactly like an unfocused one; only the text caret shows. Screenshot `form-focus-es-light`: the focused "Nombre" field and the unfocused "Correo" field are identical. Dark mode passes (mint on black, 16.09:1) except for the invalid case.
- Who is affected: keyboard users and people with low vision cannot tell which field they are typing in.
- Fix: add `&:focus-visible { @include accessibility-outline; }` to `.input` and `.textarea`. The red 3px outline with a 3px offset is 3.42:1 on light and 5.25:1 on black, and it shows in every state because it sits outside the border. This adds the site-wide focus ring to fields (visible style change).
- Status: Fixed. `.input` and `.textarea` get `@include accessibility-outline` on `:focus-visible`. Evidence: the Tab walk shows the 3px red outline on every field; screenshot `v-form-invalid-en-light` shows the focused invalid field ringed, while the other invalid fields are not.
- Update (2026-10-09): the outline now sits on the border (2px, no offset) in the border's color, so focus reads as one thicker border. It is `--valid` without an error (`#00ffc3` dark, `#008566` light) and `#f00` with one. Pixel-sampled against the field and the page: green 16.09:1 (dark) and 3.95:1 (light), red 5.25:1 and 3.42:1. A focused field with an error goes from a 2px to a 4px red border; its error text and `aria-invalid` keep the error from relying on color (1.4.1).

### F-05 Nav menus: hidden links take focus, the buttons don't say whether the menu is open, and Escape does nothing

- Criterion: 2.4.3 Focus Order (A); 2.4.7 Focus Visible (AA); 4.1.2 Name, Role, Value (A)
- Severity: Serious
- Where: `src/components/ui/Nav/NavDropdown/NavDropdown.tsx`, `NavDropdown.module.scss:11-42`, `NavMainMenu.tsx`, `NavLangMenu.tsx`, `src/components/ui/Buttons/HamburgerButton/HamburgerButton.tsx:23-27`, `src/components/ui/Buttons/IconButton/IconButton.tsx:22-28`; every page, both locales, both themes
- Evidence:
  - With both menus closed, Tab from the logo lands on "Home", "Contact", "ENG", and "SPN" (or "Home", "Contacto", "ING", "ESP"). They have `opacity: 0`, `transform: scaleY(0)`, and a 0px-tall box, so the focus ring cannot be seen. That is 4 invisible stops on every page.
  - Screen readers also list these links while the menus are closed.
  - The hamburger and globe buttons have no `aria-expanded` or `aria-controls`, so opening a menu is not announced.
  - `Escape` does not close an open menu.
  - When focus leaves an open menu, the menu and its 80% backdrop stay open.
  - Pressing `Enter` on the current-language link closes the menu but leaves focus on the now-invisible link.
- Who is affected: keyboard users lose track of focus four times on every page. Screen reader users don't know a menu opened or closed.
- Fix: follow the APG Disclosure pattern. Add `aria-expanded` and `aria-controls` on each toggle button. Hide the closed list with `visibility: hidden` (transitioned together with opacity/transform, so the animation stays) so it leaves the tab order and the accessibility tree. Close on `Escape` and return focus to the button. Close when focus moves outside the menu.
- Status: Fixed. Closed lists use `visibility: hidden`, which flips after the closing animation, so the animation is kept. The toggles have `aria-expanded` and `aria-controls`. The new `useNavMenu` hook closes the menu on Escape (focus returns to the toggle), when focus leaves the menu, and after a link is chosen (focus returns to the toggle). Evidence: the Tab walk on /en has 24 stops and none is hidden; closed-menu links are gone from the accessibility tree; Escape leaves `aria-expanded="false"` with focus on the toggle; 6 tests in `navMenu.test.tsx`.

### F-06 On small screens, keyboard focus goes behind the fixed footer

- Criterion: 2.4.11 Focus Not Obscured (Minimum) (AA)
- Severity: Serious
- Where: `src/components/ui/Footer/Footer.module.scss:3-21`, `src/components/ui/Nav/NavBar/NavBar.module.scss:3-22`, `src/styles/_global.scss:17-19`; /en and /es home, 375 px wide and narrower
- Evidence: at 375×700, tabbing forward to "See my experience", "InterplanetaryFonts", "Women Build Web3", "Alchemy University", and "Cooper Union" scrolls each link to the bottom edge, 100% under the footer (footer covers y 551–700). Screenshot `m-focus-fwd-women`: no part of the link or its focus ring is visible. At 1280×900 the same links sit under the transparent top of the footer gradient and stay visible, so desktop passes. Going backwards, links scroll under the header gradient, which is see-through enough to pass.
- Who is affected: keyboard users on phones, tablets, and zoomed desktops cannot see where focus is.
- Fix: add `scroll-padding-top` (header height, 120px) and `scroll-padding-bottom` (footer height: 152px below 768px, 88px above) on `html`. This is technique C43 in the 2.4.11 Understanding doc. No visual change.
- Status: Fixed. `html` has `scroll-padding-top` (header, plus the sticky section title below 768px) and `scroll-padding-bottom` (footer height). Evidence: the obscured-focus script, forwards and backwards at 1280×900, 375×700, 320×568 and 320×256, found 0 focused elements covered.

### F-07 Form errors are not tied to their fields, and the disabled Submit button hides why the form can't be sent

- Criterion: 3.3.1 Error Identification (A); also 1.3.1 Info and Relationships (A)
- Severity: Serious
- Where: `src/components/ui/TextInput/TextInput.tsx:54-110`, `src/hooks/useTextInput.ts`, `ContactForm.tsx:160-170`; /en/contact and /es/contact
- Evidence:
  - After leaving an empty or invalid field, the inputs have no `aria-invalid` and no `aria-describedby`. The error text ("Name is required", "Invalid email") is a plain `<p>` after the field and is not announced.
  - The Submit button is `disabled` until every field is valid, so a user who never visited a field gets no message at all. Screen readers announce only "Submit, dimmed".
  - `handleChange` passes the validity from the previous render (`TextInput.tsx:48-52`), so validity runs one keystroke behind. In testing, Tab from a just-completed message field skipped the still-disabled Submit button and landed on "GitHub Link".
- Who is affected: screen reader users don't hear errors or which field has them. Everyone faces a button that won't work with no reason given.
- Fix:
  - Keep the button enabled.
  - On submit with errors, show all errors and move focus to the first invalid field.
  - Set `aria-invalid="true"` and `aria-describedby="<id>-error"` on invalid fields, and give each error `<p>` that id.
  - Compute validity from the new value in `handleChange`.
- Status: Fixed. Submit is always enabled. Submitting with errors shows every error and focuses the first invalid field. Fields get `aria-invalid` and `aria-describedby` (error plus hint). Validity is computed from the new value. Evidence: in Chrome, pressing Enter on Submit with empty fields moved focus to Name, which exposes invalid=true with the description "Please enter your name 3 to 100 characters". Tab from a just-completed message now lands on Submit. Covered by `contactForm.test.tsx`.

### F-08 Error messages don't say how to fix the problem, and valid input is rejected

- Criterion: 3.3.3 Error Suggestion (AA); also 3.3.2 Labels or Instructions (A)
- Severity: Serious
- Where: `src/utils/constants/form.constants.ts:1-9`, `src/utils/client/form.utils.ts`, `src/utils/server/form.utils.ts:4-17`, dictionaries `contact.form.errors.invalid`; /en/contact and /es/contact
- Evidence:
  - The message rule `/^.*$/` has no `s` flag, so any line break makes the message invalid ("Invalid message"), on both client and server. A message with paragraphs can never be sent.
  - The name rule allows only letters, spaces, and dots, so "O'Brien" and "Jean-Luc" get "Invalid name".
  - The email rule rejects `+` addresses (`ada+site@gmail.com`) and TLDs longer than 4 letters (`.studio`), and shows "Invalid email".
  - None of these messages says what is allowed.
- Who is affected: everyone, and especially people with cognitive disabilities and screen reader users, who must guess what is wrong.
- Fix: write messages that say what to do ("Use letters, spaces, apostrophes, or hyphens", "Write at least 10 characters", "Enter an email like name@example.com") in both dictionaries. Let the message rule accept line breaks. Decision needed: also widen the name and email rules (client and server) so real names and addresses pass.
- Status: Fixed. Messages say what to do, in both languages. Messages accept line breaks; names accept apostrophes and hyphens; emails accept `+` and long TLDs. The rules are shared, so client and server match. Evidence: `validation.test.ts` (O'Brien, Jean-Luc, José María, ada+site@gmail.com, .studio, and a multi-line message through `serverFormValidations`); Chrome run with a typed two-line message.

### F-09 Sending, success, and error are not announced, and focus is lost on submit

- Criterion: 4.1.3 Status Messages (AA); also 4.1.2 Name, Role, Value (A), 1.1.1 Non-text Content (A), 2.4.3 Focus Order (A)
- Severity: Serious
- Where: `ContactForm.tsx:160-170`, `src/components/wrappers/FormWrapper/FormWrapper.tsx:22-30`, `src/components/ui/Spinner/Spinner.tsx:19-43`, `src/components/wrappers/MainWrapper/MainWrapper.tsx:14-25`; /en/contact and /es/contact
- Evidence:
  - While sending, the Submit button becomes `disabled`, and its only content is the spinner SVG, which has no name, so the button's accessible name is empty. Focus falls to `<body>` (observed with `document.activeElement`).
  - "The form was submitted successfully!" and "There was an error submitting the form" render in a plain `<p>` with no `role="status"` or `aria-live`, so screen readers say nothing.
  - The page-level loading spinner in `MainWrapper` also has no name.
- Who is affected: screen reader users press Submit and hear nothing. They don't know if the message was sent, failed, or is still sending.
- Fix:
  - Always render a `role="status"` region in the form and put the success or error text in it.
  - Give `Spinner` an optional label (`role="img"` and `aria-label`, e.g. "Sending…" / "Enviando…"), or keep visually hidden button text while sending.
  - Use `aria-disabled` instead of `disabled` while sending, so focus stays on the button.
- Status: Fixed. `FormWrapper` always renders a `role="status"` paragraph. While sending, the button uses `aria-disabled` and shows a spinner labeled "Sending…"/"Enviando…". Evidence: in Chrome, focus stayed on the button with name "Sending…" and `aria-disabled="true"`; the success and error messages appeared in the status region, in English and Spanish.

### F-10 The home subtitle has no spaces between its words

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Moderate
- Where: `src/app/[locale]/components/HomeSubtitle/HomeSubtitle.tsx:13-31`; /en and /es home
- Evidence: the `<h2>` text content and accessible name are "DesignEngineer·ProductEngineer" ("IngenierodeDiseño·eIngenierodeProducto" in Spanish). Each word is a flex item, so the spaces exist only as CSS `gap`.
- Who is affected: screen reader users may hear run-together words, braille users read one long word, and copy and paste gives the same.
- Fix: render a real space (`{' '}`) between the word spans. No visual change.
- Status: Fixed. Real spaces between the word spans; the flex gap still sets the look. Evidence: the accessibility tree names the heading "Ingeniero de Diseño · Ingeniero de Producto"; unit test in `themeAndText.test.tsx`.

### F-11 Name and email fields don't declare their purpose

- Criterion: 1.3.5 Identify Input Purpose (AA)
- Severity: Moderate
- Where: `src/components/ui/TextInput/TextInput.tsx:69-94`, `ContactForm.tsx:106-132`; /contact
- Evidence: `autocomplete` is `null` on `#name` and `#email`.
- Who is affected: people with motor or cognitive disabilities who rely on autofill, and users of tools that add icons to known fields.
- Fix: pass `autoComplete="name"` and `autoComplete="email"`.
- Status: Fixed. `autocomplete="name"` and `autocomplete="email"`. Evidence: `contactForm.test.tsx`.

### F-12 Links inside cards look like the text around them

- Criterion: 1.4.1 Use of Color (A)
- Severity: Moderate
- Where: `src/styles/_global.scss:101-127` (links have no underline until hover), `HomeSection.module.scss:115-125`; /en and /es home, the company line of each card
- Evidence: in "BevNET.com, Inc. · Contract · Remote" the link differs from the text next to it only by lightness: #ededed vs. #ededed at 65% opacity on dark cards (2.40:1), and black vs. black at 65% on light cards (2.73:1). Technique G183 needs at least 3:1 plus an extra cue on hover and focus (failure F73). The role-title links ("Melvin Pay", "InterplanetaryFonts") look exactly like the non-link titles.
- Who is affected: people with color-vision differences or low vision can't find the links.
- Fix (visual change, needs your OK): show a thin underline on links inside cards at all times, or lower the meta text to reach 3:1 against the link and keep the hover underline.
- Status: Fixed. Links in cards have a 1px underline. Evidence: axe no longer reports `link-in-text-block` as incomplete; the Tab walk shows each link.

### F-13 The success message disappears after 10 seconds

- Criterion: 2.2.1 Timing Adjustable (A)
- Severity: Moderate
- Where: `ContactForm.tsx:97-100`; /contact
- Evidence: `setTimeout(() => setSubmitMessage(''), 10000)`. The form also resets, so after 10 seconds nothing on the page shows the message was sent. The Understanding doc's "toast" exception covers only messages that have another way to be seen.
- Who is affected: people who read slowly, look away, or use magnification and are reading another part of the screen.
- Fix: remove the timeout. Clear the message when the user starts typing again.
- Status: Fixed. The 10-second timeout is removed; the message clears when the user types again. Evidence: in Chrome the success and error messages were still there after 11 s; the unit test advances 30 s and then checks that typing clears it.

### F-14 The scroll chevron bounces forever

- Criterion: 2.2.2 Pause, Stop, Hide (A)
- Severity: Moderate
- Where: `src/app/[locale]/components/ScrollCue/ScrollCue.module.scss:28-32`; /en and /es home
- Evidence: `animation: scroll-bounce 1.6s ease-in-out infinite`. It starts automatically, lasts more than five seconds, and sits next to other content. The `prefers-reduced-motion` rule stops it (verified), but the 2.2.2 Understanding doc requires a mechanism on the page; an OS setting is not listed.
- Who is affected: people with attention disorders, who find constant motion distracting.
- Fix: stop after three bounces (`animation-iteration-count: 3`, 4.8 s). The animation stays, it just ends.
- Status: Fixed. `animation-iteration-count: 3` (4.8 s). Evidence: computed `animation-iteration-count` is `3`; with reduced motion, the animation is `none`.

### F-15 Resources and 404 pages reuse the home page title

- Criterion: 2.4.2 Page Titled (A)
- Severity: Moderate
- Where: `src/utils/server/meta.utils.ts:22-29` (falls back to `meta.default`), `src/app/[locale]/resources/page.tsx`, `src/app/[locale]/not-found.tsx`
- Evidence: the `<title>` of /en/resources and every English 404 is "Eduardo Aire Torres | Design Engineer & Product Engineer". On /es it's "Eduardo Aire Torres | Ingeniero de Diseño e Ingeniero de Producto". Home and contact titles are correct in both locales.
- Who is affected: screen reader users, and anyone switching tabs, can't tell they landed on a 404 or the resources page.
- Fix: add `resources` and `notFound` entries to `meta` in both dictionaries (e.g. "Page not found | Eduardo Aire Torres" / "Página no encontrada | Eduardo Aire Torres") and use them on those pages.
- Status: Fixed. New `meta.resources` and `meta.notFound` entries in both dictionaries. Resources uses `generateMetadata`; the 404 page renders a `<title>` that React 19 hoists into the head, because `not-found.js` can't export metadata. Evidence: `document.title` in Chrome is "Resources | …", "Recursos | …", "Page not found | …" and "Página no encontrada | …". Caveat: until React loads, a 404's server HTML has the site name as its title.

### F-16 Spanish pages expose English names and text

- Criterion: 3.1.2 Language of Parts (AA)
- Severity: Moderate
- Where:
  - `src/components/brand/EatHomeButton/EatHomeButton.tsx:24,29`: "Home"
  - `src/models/dictionaries/es.json:14`: nav "Home"
  - `src/components/ui/SocialLinks/*.tsx`: "GitHub Link", "LinkedIn Link", "X Link", "Instagram Link", "Email Link"
  - `SectionCard.tsx:63`: "Tech stack" (×7)
  - `src/app/[locale]/resources/page.tsx`: "Resources", "Resources will be listed here..."
  - `src/app/[locale]/not-found.tsx:4`: "404 - Page Not Found!"
- Evidence: Chrome's accessibility tree on `lang="es"` pages shows all of the names above in English.
- Who is affected: Spanish screen reader users hear English words read with Spanish pronunciation.
- Fix: move every string into both dictionaries and the `Dictionary` class: "Inicio", "GitHub", "Correo", "Tecnologías", "Recursos", "Página no encontrada". Drop the "Link"/"Button" suffixes (see F-18).
- Status: Fixed. Every string comes from the dictionaries: "Inicio", "Correo", "Tecnologías", "Recursos", "404 - Página no encontrada", "Saltar al contenido", "Idioma". Brand names (GitHub, LinkedIn, X, Instagram) stay as they are. Evidence: the full Spanish accessibility tree has no English names left.

### F-17 Required fields and length hints are not explained

- Criterion: 3.3.2 Labels or Instructions (A)
- Severity: Moderate
- Where: `src/components/ui/TextInput/TextInput.tsx:57-67,100-109`; /contact
- Evidence:
  - Labels read "Name*", "Email*", "Message*", and the asterisk becomes part of the accessible name ("Nombre*"). Nothing says what "*" means.
  - The "3 - 100" and "10 - 255" hints and the "12/100" counter are not explained and are not linked to their fields.
- Who is affected: people with cognitive disabilities and screen reader users, who hear "Name star" and don't get the length limits.
- Fix: add one line above the form, "Fields marked * are required" / "Los campos con * son obligatorios". Hide the "*" from the accessible name (`aria-hidden`), since `required` already announces it. Turn the hint into words ("3 to 100 characters") and link it with `aria-describedby`.
- Status: Fixed. "Fields marked * are required." / "Los campos con * son obligatorios." appears above the fields; the `*` is `aria-hidden`; the hint reads "3 to 100 characters" / "De 3 a 100 caracteres" and is linked with `aria-describedby`. Evidence: accessibility tree `textbox:"Nombre" desc="De 3 a 100 caracteres"`.
- Update (2026-10-09): every field is required, so the asterisks are gone. One line before the fields reads "Please fill in all the fields." / "Llena todos los campos, por favor." Labels plus an instruction at the top of the form meet [3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions) (G131 with [G184](https://www.w3.org/WAI/WCAG22/Techniques/general/G184)); `aria-required` is only advisory there (ARIA2), and native `required` already exposes the state. Evidence: accessibility tree `textbox:"Nombre" required desc="De 3 a 100 caracteres"`.

### F-18 The theme toggle doesn't expose its state, and the footer misuses `aria-label`

- Criterion: 4.1.2 Name, Role, Value (A)
- Severity: Moderate
- Where: `src/components/ui/Buttons/ThemeButton/ThemeButton.tsx:19-34`, `src/components/ui/Footer/Footer.tsx:53-59`; every page
- Evidence:
  - The button is named "Toggle Theme Button" / "Botón para cambiar de tema", with no `aria-pressed` and no change of name, so screen reader users can't tell which theme is on.
  - `<p aria-label="Theme Section">` triggers axe `aria-prohibited-attr` on all 8 pages. ARIA 1.2 doesn't allow naming a paragraph, so screen readers ignore the label.
  - Names repeat the role ("Language Select Button, button"; "GitHub Link, link").
  - The 💡 emoji is hidden behind the `aria-label`, which is fine.
- Who is affected: screen reader users.
- Fix: name the button by its action and state, "Switch to light theme" / "Cambiar a tema claro" (and back), or keep a fixed name "Dark theme" with `aria-pressed`. Remove `aria-label` from the `<p>`. Remove "Button"/"Link" from names, in both dictionaries.
- Status: Fixed. The theme button is named "Switch to light theme"/"Switch to dark theme" ("Cambiar a tema claro/oscuro") and updates after toggling. The `aria-label` on `<p>` is gone, and names no longer end in "Link"/"Button". Evidence: axe no longer reports `aria-prohibited-attr`; unit test in `themeAndText.test.tsx`; Tab walk names.

### F-19 The loading fallback renders the whole page twice

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Minor
- Where: `src/components/wrappers/MainWrapper/MainWrapper.tsx:14-25,31`; every page while it streams
- Evidence: while the Suspense boundary is pending, `Loading` renders a second `<main>` with `{children}`, so the page has two `main` landmarks with the same content and duplicate ids (`experience`, `projects`, `education`). Seen in the in-app browser, which stays in this state because it doesn't paint frames. In headless Chrome it lasts only until streaming ends.
- Who is affected: screen reader users on slow connections may hear two copies of the page.
- Fix: make the fallback show only the spinner (with a `role="status"` label) and not `children`.
- Status: Fixed. On 2026-10-08 the loading fallback was removed: pages are now prerendered, so there is nothing to wait for, and the HTML has one `<main>`. Evidence: the raw HTML of /en has one `<main>` and one `<h1>`.

### F-20 Language links use unclear abbreviations

- Criterion: 2.4.4 Link Purpose (In Context) (A)
- Severity: Minor
- Where: `src/models/dictionaries/en.json:17-18`, `es.json:17-18`, `NavLangMenu.tsx`
- Evidence: the links read "ENG"/"SPN" on English pages and "ING"/"ESP" on Spanish pages. Chrome exposes them in capitals ("SPN"), which screen readers may spell out. The list has no label linking it to the globe button, so the link text must stand on its own.
- Who is affected: screen reader and voice-control users, and anyone who doesn't recognize "SPN".
- Fix: use "English" and "Español", each with its own `lang` attribute (`lang="en"`, `lang="es"`). If you want to keep the short visible text, add an `aria-label` with the full name.
- Status: Fixed. The links read "English" and "Español", with `lang` and `hreflang`, and the active one has `aria-current="page"`. Evidence: `navMenu.test.tsx`; screenshot `v-langmenu-es-light` shows both fit the dropdown.

### F-21 Home title may be read letter by letter

- Criterion: 1.3.1 Info and Relationships (A)
- Severity: Needs review
- Where: `src/app/[locale]/components/HomeTitle/HomeTitle.tsx`
- Evidence: the `<h1>` is built from 19 inline `<span>`s. Chrome's accessibility tree names the heading "Eduardo Aire Torres", which is good. Because the spans are inline (not flex, unlike F-10), most screen readers should read it as words.
- Who is affected: screen reader users, if their browser and screen reader pair splits the spans.
- What would settle it: test with NVDA + Chrome and VoiceOver + Safari. If either splits it, add `aria-label` on the `<h1>` and `aria-hidden` on the spans.
- Status: Closed (2026-10-06): accepted on code review by the site owner, no screen reader run. The spans are inline and hold no spaces of their own, Chrome exposes the heading as "Eduardo Aire Torres", and the text content is the full name, so it is treated as passing. If someone does hear it letter by letter, add `aria-label` on the `<h1>` and `aria-hidden` on the spans.

### F-22 The Resources page can't be reached from the site

- Criterion: 2.4.5 Multiple Ways (AA)
- Severity: Needs review
- Where: `src/app/[locale]/resources/page.tsx`, `PageUrls.resources_` (unused in the nav)
- Evidence: /en/resources and /es/resources return 200 but are not linked from any menu or page. They show only a placeholder ("Resources will be listed here..."). Home and Contact are reachable from the nav menu on every page.
- Who is affected: anyone who would need the page.
- What would settle it: tell me whether /resources is a published page. If it is, link it from the nav. If it isn't yet, it can return 404 until it's ready, which also removes F-15 and F-16 for that page.
- Status: Closed (2026-10-06). Following my recommendation, `/resources` returns 404 until it has content (the `RESOURCES_PUBLISHED` flag in `src/utils/constants/site.constants.ts`); the translated text stays in the dictionaries for later. Evidence: /en/resources and /es/resources return HTTP 404 with `<meta name="robots" content="noindex">`; Chrome shows "404 - Page not found" / "404 - Página no encontrada" with the matching title; test `resources.test.ts`. To publish it: set the flag to `true` and add a nav link in `NavMainMenu`.

### F-23 The particle background moves with no pause control

- Criterion: 2.2.2 Pause, Stop, Hide (A); also checked against 2.3.1 Three Flashes or Below Threshold (A) and 1.4.3 Contrast (Minimum) (AA)
- Severity: Moderate
- Where: `src/components/art/ParticleBackground/` (mounted once in `BodyWrapper`); every page, both locales, both themes. Added on branch `feat/particle-background` (2026-10-06).
- Evidence: a full-screen WebGL field of drifting letters behind the content. It starts automatically, runs for as long as the page is open, and sits next to other content. There is no pause button. The 2.2.2 Understanding doc does not count an OS setting such as reduced motion as the mechanism, so this does not meet 2.2.2.
- Who is affected: people with attention disorders or vestibular conditions, who find constant motion distracting, if they have not turned on reduced motion.
- Decision: the site owner chose not to add visible UI. This is a known deviation, accepted by the owner. The mitigations below go beyond common practice for animated portfolio backgrounds.
- Mitigations (all verified in Chrome 154 over CDP, dev build):
  - **Reduced motion:** with `prefers-reduced-motion: reduce`, the scene draws one still frame and never starts its loop (1 draw in 3 s). Turning the setting off while the page is open starts the loop (30 frames/s); turning it on again stops it at once. Test: `particleBackground.test.tsx`.
  - **Hidden tab:** the loop stops while the tab is hidden (draws stayed at 265 for 3 s with another tab in front) and resumes when it is shown again.
  - **Soft and low contrast:** the canvas is drawn at 20% opacity over the solid page background. In the dark theme, no background pixel can be brighter than 20% gray (worst measured: relative luminance 0.033). In the light theme, a particle darkens the page by at most 5% (worst measured: 0.768 against 0.846 for the plain background).
  - **No flashing (2.3.1):** a flash needs opposing luminance changes of at least 0.10. The 20% opacity caps the change at 0.033 in the dark theme and 0.093 in the light theme (0.08 measured), so the background cannot flash, at any rate.
  - **Contrast (1.4.3):** text was hidden and the background behind every text run sampled 10 times over 10 s, on /en, /es, /en/contact and the 404 page in both themes. 0 failures. Lowest values: body text 14.40:1 (dark) and 16.67:1 (light); headings 10.79:1; the red home subtitle (large text) 3.16:1 (dark) and 3.12:1 (light). The nav, footer and form sit on opaque surfaces and are unchanged (17.78:1 or more).
  - **Out of the way:** the canvas is `aria-hidden`, has `pointer-events: none`, and is not focusable. A mouse and keyboard run of the nav menu, language links, contact form, theme button, skip link and Escape passed with the canvas in place.
- Status: Accepted (2026-10-06), as a known deviation. To meet 2.2.2 later, add a visible pause button that stops the loop and stores the choice.

---

## 3. Criteria table

| Criterion                                       | Level | Result | Findings                                                                                                                |
| ----------------------------------------------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content                          | A     | Pass   | F-09 fixed                                                                                                              |
| 1.2.1 Audio-only and Video-only (Prerecorded)   | A     | N/A    | No audio or video                                                                                                       |
| 1.2.2 Captions (Prerecorded)                    | A     | N/A    | No video                                                                                                                |
| 1.2.3 Audio Description or Media Alternative    | A     | N/A    | No video                                                                                                                |
| 1.2.4 Captions (Live)                           | AA    | N/A    | No live media                                                                                                           |
| 1.2.5 Audio Description (Prerecorded)           | AA    | N/A    | No video                                                                                                                |
| 1.3.1 Info and Relationships                    | A     | Pass   | F-07, F-10, F-19 fixed; F-21 closed on code review                                                                      |
| 1.3.2 Meaningful Sequence                       | A     | Pass   | DOM order matches visual order on all pages                                                                             |
| 1.3.3 Sensory Characteristics                   | A     | Pass   | No shape/position-only instructions                                                                                     |
| 1.3.4 Orientation                               | AA    | Pass   | No orientation lock                                                                                                     |
| 1.3.5 Identify Input Purpose                    | AA    | Pass   | F-11 fixed                                                                                                              |
| 1.4.1 Use of Color                              | A     | Pass   | F-12 fixed                                                                                                              |
| 1.4.2 Audio Control                             | A     | N/A    | No audio                                                                                                                |
| 1.4.3 Contrast (Minimum)                        | AA    | Pass   | F-01, F-03 fixed; particle background measured (F-23)                                                                   |
| 1.4.4 Resize Text                               | AA    | Pass   | 200% (640×450): no loss of content or function                                                                          |
| 1.4.5 Images of Text                            | AA    | Pass   | Only the logo (exempt)                                                                                                  |
| 1.4.10 Reflow                                   | AA    | Pass   | No horizontal scroll at 320 px wide. See Nice to have for 320×256                                                       |
| 1.4.11 Non-text Contrast                        | AA    | Pass   | F-04 fixed                                                                                                              |
| 1.4.12 Text Spacing                             | AA    | Pass   | WCAG spacing overrides on /en, /es, /en/contact: no clipped or lost text                                                |
| 1.4.13 Content on Hover or Focus                | AA    | Pass   | Only native `title` tooltips on tech icons (browser-controlled)                                                         |
| 2.1.1 Keyboard                                  | A     | Pass   | All controls work with Enter/Space                                                                                      |
| 2.1.2 No Keyboard Trap                          | A     | Pass   | Tab cycles through to the end on every page                                                                             |
| 2.1.4 Character Key Shortcuts                   | A     | N/A    | No shortcuts                                                                                                            |
| 2.2.1 Timing Adjustable                         | A     | Pass   | F-02, F-13 fixed                                                                                                        |
| 2.2.2 Pause, Stop, Hide                         | A     | Fail   | F-14 fixed; F-23 accepted deviation: particle background has no pause control                                           |
| 2.3.1 Three Flashes or Below Threshold          | A     | Pass   | Nothing flashes; F-23 background luminance changes stay under 0.10                                                      |
| 2.4.1 Bypass Blocks                             | A     | Pass   | Landmarks, plus a skip link added 2026-10-06                                                                            |
| 2.4.2 Page Titled                               | A     | Pass   | F-15 fixed                                                                                                              |
| 2.4.3 Focus Order                               | A     | Pass   | F-05, F-09 fixed                                                                                                        |
| 2.4.4 Link Purpose (In Context)                 | A     | Pass   | F-20 fixed                                                                                                              |
| 2.4.5 Multiple Ways                             | AA    | Pass   | F-22 closed: `/resources` returns 404; Home and Contact are in the nav on every page                                    |
| 2.4.6 Headings and Labels                       | AA    | Pass   | Headings and labels describe their content                                                                              |
| 2.4.7 Focus Visible                             | AA    | Pass   | F-01, F-04, F-05 fixed                                                                                                  |
| 2.4.11 Focus Not Obscured (Minimum)             | AA    | Pass   | F-06 fixed                                                                                                              |
| 2.5.1 Pointer Gestures                          | A     | N/A    | No multipoint or path gestures                                                                                          |
| 2.5.2 Pointer Cancellation                      | A     | Pass   | Actions fire on click (up event)                                                                                        |
| 2.5.3 Label in Name                             | A     | Pass   | Text controls' names match visible text. Icon-only controls have no visible label (N/A per Understanding doc)           |
| 2.5.4 Motion Actuation                          | A     | N/A    | No motion input                                                                                                         |
| 2.5.7 Dragging Movements                        | AA    | N/A    | No dragging                                                                                                             |
| 2.5.8 Target Size (Minimum)                     | AA    | Pass   | Icon buttons 30×30, theme button 24×24. 16px-tall menu links pass the 24px spacing test. Card links are inline (exempt) |
| 3.1.1 Language of Page                          | A     | Pass   | `<html lang="en">` / `lang="es"`; unknown locales redirect                                                              |
| 3.1.2 Language of Parts                         | AA    | Pass   | F-16 fixed                                                                                                              |
| 3.2.1 On Focus                                  | A     | Pass   | No context change on focus                                                                                              |
| 3.2.2 On Input                                  | A     | Pass   | No auto-submit or auto-navigation                                                                                       |
| 3.2.3 Consistent Navigation                     | AA    | Pass   | Same header and footer on every page                                                                                    |
| 3.2.4 Consistent Identification                 | AA    | Pass   | Same components, same names                                                                                             |
| 3.2.6 Consistent Help                           | A     | Pass   | Email link in the footer and Contact in the nav, same place on every page                                               |
| 3.3.1 Error Identification                      | A     | Pass   | F-02, F-07 fixed                                                                                                        |
| 3.3.2 Labels or Instructions                    | A     | Pass   | F-08, F-17 fixed                                                                                                        |
| 3.3.3 Error Suggestion                          | AA    | Pass   | F-08 fixed                                                                                                              |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA    | N/A    | No legal, financial, or data-changing submissions                                                                       |
| 3.3.7 Redundant Entry                           | A     | Pass   | Single step; values are kept after an error                                                                             |
| 3.3.8 Accessible Authentication (Minimum)       | AA    | N/A    | No sign-in. reCAPTCHA v3 shows no challenge (third party)                                                               |
| 4.1.2 Name, Role, Value                         | A     | Pass   | F-05, F-09, F-18 fixed                                                                                                  |
| 4.1.3 Status Messages                           | AA    | Pass   | F-09 fixed                                                                                                              |

Results are after the 2026-10-06 fixes. Before the fixes, every row that lists a fixed finding was a Fail. 4.1.1 Parsing is obsolete in WCAG 2.2 and not evaluated.

---

## 4. Leads

All leads marked Confirmed are now fixed; see each finding's status.

| Lead                                                                                                    | Result                                        | Evidence                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accent #f00 on #ededed ≈ 3.42:1 (active link, hover, form errors)                                       | Confirmed                                     | axe 3.41:1 on the active link; error text 3.42:1; also card dates 3.38–3.42:1 in both themes (F-03).                                                                                                                                                                           |
| Field focus is only a #00ffc3 border (1.11:1 on light)                                                  | Confirmed                                     | `outline: none` with a mint border, 1.11:1 on #ededed; invalid fields show no change at all (F-04).                                                                                                                                                                            |
| Closed dropdowns still in tab order; no `aria-expanded`/`aria-controls`; no Escape; no focus management | Confirmed                                     | 4 invisible tab stops on every page; no state attributes; Escape does nothing; focus left on a hidden link after choosing a language (F-05).                                                                                                                                   |
| No skip link (2.4.1)                                                                                    | Confirmed no skip link, rejected as a failure | There is no skip link, but the landmarks satisfy 2.4.1 (ARIA11). Still worth adding (Nice to have).                                                                                                                                                                            |
| Hard-coded English names on Spanish pages; `aria-label` plus a different sr-only span                   | Confirmed                                     | Accessibility tree on /es shows "Home", "GitHub Link", "Tech stack", "Resources", "404 - Page Not Found!" (F-16). Pairs differ ("GitHub Link" vs "GitHub", "Language Select Button" vs "Languages"); the `aria-label` wins, so the span is dead weight (F-18).                 |
| `aria-label` on `<p>` in the footer                                                                     | Confirmed                                     | axe `aria-prohibited-attr` on all 8 pages (F-18).                                                                                                                                                                                                                              |
| Errors not tied to fields; no live region; `*` only; disabled submit hides why                          | Confirmed                                     | No `aria-invalid` or `aria-describedby`; no live region anywhere; unexplained `*`; button disabled until valid (F-07, F-09, F-17).                                                                                                                                             |
| Success message disappears after 10 s                                                                   | Confirmed                                     | Gone 10 s after a mocked success; the form also resets, so nothing else confirms it (F-13).                                                                                                                                                                                    |
| Spinner has no name or status text                                                                      | Confirmed                                     | The Submit button's name is empty while sending, and focus drops to `<body>` (F-09).                                                                                                                                                                                           |
| `HomeTitle` splits the `<h1>` into letters                                                              | Needs review                                  | Chrome names the heading "Eduardo Aire Torres"; no screen reader available to confirm (F-21). The subtitle does lose its spaces (F-10).                                                                                                                                        |
| `template.tsx` and `FadeTransition` ignore reduced motion; check 2.2.2                                  | Confirmed (AAA only); FadeTransition unused   | With reduced motion emulated, the page still slides 30px for 1 s (2.3.3 AAA, Nice to have). `FadeTransition` is imported nowhere. Nothing in them lasts > 5 s. But the ScrollCue chevron is infinite (F-14), and `SectionCard`'s reduced-motion branch hides all cards (F-01). |
| Theme toggle 💡: name and state                                                                         | Confirmed                                     | The name is fine; the state is not exposed (F-18).                                                                                                                                                                                                                             |
| Titles, headings, reflow, spacing, zoom, target size, new-tab links                                     | Partly confirmed                              | Titles fail on resources and 404 (F-15). Heading order passes. Reflow, text spacing, 200% zoom, and target size pass. New-tab links have no warning, which is not an A/AA failure (Nice to have).                                                                              |

---

## 5. Nice to have

AAA items and best practices (not required for AA):

- **Done 2026-10-06, Reflow at 320×256 (400% zoom on a 1280×1024 screen):** the fixed header (120px) and footer (149px) cover the whole viewport, and nothing can be read. 1.4.10 only requires 320 px _width_ for vertical pages, so this passes AA, but it is a serious usability problem for low-vision users. Make the header and footer static when `max-height` is small (e.g. ≤ 500px).
- **Done 2026-10-06, Skip link:** add a "Skip to content" link as the first focusable item. It's cheap, and it helps keyboard users who don't use landmarks.
- **Done 2026-10-06, 2.3.3 Animation from Interactions (AAA):** the page-enter slide in `template.tsx` ignores reduced motion. The `MotionConfig reducedMotion="user"` fix in F-01 handles this too.
- **2.4.13 Focus Appearance (AAA):** the red outline is 3.42:1 on light. That passes 1.4.11 but is weaker than AAA would like.
- **1.4.6 Contrast (Enhanced) (AAA):** red on black is 5.25:1 (AAA needs 7:1).
- **Done 2026-10-06, 3.2.5 Change on Request (AAA) / G201:** 14 card links and 4 social links open a new tab without warning. Add "(opens in a new tab)" / "(se abre en otra pestaña)" as visually hidden text.
- **404 pages without JavaScript:** the server sends an empty document (no `lang`, no heading) and React builds the 404 page in the browser. The status (404) and `noindex` are correct. Next.js does this for `notFound()` when the root layout sits under `[locale]`; its experimental `global-not-found.js` is the documented way out.
- **Content is hidden without JavaScript:** the server HTML ships every page's content at `opacity: 0` (`template.tsx`), so if JS is slow or fails, the page stays blank.
- **Done 2026-10-09, short screens:** at 320×256 the scroll chevron (absolutely positioned at the bottom of the hero) overlapped two words of the summary. It now sits in the flow under the text, and on phones too short to fit it above the footer it is hidden.
- **Done 2026-10-09, mobile overlap:** at 375px the sticky section titles ("Experience") slid over the logo button in the header. Below 768px they now pass under the header.
- **Done 2026-10-06, Third party, reCAPTCHA badge:** it is hidden with `visibility: hidden` in `_normalize.scss`, which is fine for accessibility (it leaves the accessibility tree). Google's terms ask for the notice text ("This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.") to be shown when the badge is hidden. Add it under the form, in both languages.
- **Third party, Typekit:** Degular loads and passed the text-spacing test. Nothing to fix.

Out of scope (not accessibility):

- The dev container does not pick up file edits (it serves stale code until `docker compose restart frontend`), even with `WATCHPACK_POLLING=true`. Next 16 uses Turbopack by default, so that variable may no longer apply.

- The Docker volume had stale `node_modules` (Next 15.5.21 vs. the locked 16.3.6). As a result, `src/proxy.ts` never ran in dev: `/` returned 404 and `/contact` returned 500. Fixed locally with `pnpm install --frozen-lockfile`. The old dev server had also rewritten `tsconfig.json`; I reverted that.
- Fixed 2026-10-08: `src/app/robots.ts` pointed `sitemap` at `https://acme.com/sitemap.xml`.
- `src/components/transitions/FadeTransition.tsx` is unused.
- `/resources` returns 404 until it has content (see F-22).
