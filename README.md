# eduairet.com

![The eat logo](./_docs/img/eat-logo-100px-white.svg#gh-dark-mode-only)
![The eat logo](./_docs/img/eat-logo-100px-black.svg#gh-light-mode-only)

My portfolio, in English and Spanish: [www.eduairet.com](https://www.eduairet.com/).

## Stack

Next.js 16 (App Router), React 19, TypeScript, SCSS modules, and three.js. GitHub Actions build it and deploy it to Vercel.

## Run it

Create a `.env` with `NEXT_PUBLIC_TYPEKIT`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `GMAIL`, and `GMAIL_PASSWORD`, then:

```bash
docker compose up -d
```

The site runs at http://localhost:3000/en. The container keeps its own `node_modules`, so after a dependency change run `docker compose down -v && docker compose up -d --build`.

## Check it

```bash
npx tsc --noEmit
pnpm lint
pnpm test run
npx prettier --check . --end-of-line auto
```

## Credits

The PHP logo on the experience cards is by Colin Viebrock, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) ([source](https://www.php.net/download-logos.php)). It is changed to one color, using the path from [Simple Icons](https://simpleicons.org), and `PhpIcon.tsx` is shared under the same license.

## Docs

- [Accessibility audit (WCAG 2.2 AA)](_docs/accessibility/wcag-audit.md)
- [Performance (Lighthouse)](_docs/performance/lighthouse.md)
- [SEO decisions](_docs/seo/seo-audit.md)
- [Security policy](SECURITY.md)
