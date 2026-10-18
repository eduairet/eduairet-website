# SEO

Last verified: 2026-10-17.

## Scope and method

Checks are against the production server from `pnpm build` and `pnpm start --port 3000` (Next.js 16.4.0), plus the source that emits the tags.

Commands used:

```bash
curl -sI http://127.0.0.1:3000/en
curl -s http://127.0.0.1:3000/sitemap.xml
curl -s http://127.0.0.1:3000/robots.txt
curl -s http://127.0.0.1:3000/en
```

User agents for the head check: a browser, Googlebot, facebookexternalhit, and Slackbot. Each received a canonical in `head` for `/en`.

`node -e "import('./oldPortfolioPages.mjs').then(m => console.log(m.oldPortfolioPages.length))"` prints 106.

`rg -c "slug: '" src/utils/constants/projects.constants.ts` prints 12.

Search Console data, Vercel dashboard rules, and the schema.org validator are outside the scope of this report.

## Metadata

Indexable pages are prerendered with metadata in `head`. The list is `indexablePaths` in `src/utils/server/meta.utils.ts`: home, projects, contact, privacy, and each project slug.

Checked samples return 200, have no `noindex`, and have a self canonical on `https://www.eduairet.com`. The samples are `/en`, `/es`, `/en/contact`, `/es/contact`, `/en/privacy`, `/en/projects`, and `/en/projects/collectible-pleasures`.

`hreflang` is `en`, `es`, and `x-default`. Home `x-default` is `https://www.eduairet.com` with no trailing path. Contact `x-default` is `https://www.eduairet.com/contact`. The English home canonical is `https://www.eduairet.com/en`.

`/` returns 302 and `Vary: Accept-Language`. With `Accept-Language: es` the location is `/es`. Without that header the location is `/en`. The redirect is `proxy` in `src/proxy.ts`.

Titles on the production build:

- `/en`: Eduardo Aire Torres | Design Engineer & Product Engineer
- `/es`: Eduardo Aire Torres | Ingeniero de Diseño y Producto
- `/en/contact`: Contact | Eduardo Aire Torres
- `/es/contact`: Contacto | Eduardo Aire Torres
- `/en/projects`: Projects | Eduardo Aire Torres
- `/en/privacy`: Privacy notice | Eduardo Aire Torres

The Spanish home title is 52 characters. `node -e "console.log('Eduardo Aire Torres | Ingeniero de Diseño y Producto'.length)"` prints 52.

Home Open Graph image is `https://www.eduairet.com/en/opengraph-image`. A project page uses `https://www.eduairet.com/projects/<slug>/og.jpg`. `OG_IMAGE_SIZE` is 1200 by 630. Each `head` also links the locale feed (`/en/feed.xml` or `/es/feed.xml`) as `application/rss+xml`.

`/favicon.ico` returns 200 `image/x-icon`. `/icon.svg` returns 200 `image/svg+xml`. `/manifest.webmanifest` returns 200 `application/manifest+json`.

`HomeSubtitle` inserts a real space between words, so the subtitle text is not only a flex gap.

## Structured data

Home JSON-LD types are `WebSite` and `ProfilePage`. `Person` is `ProfilePage.mainEntity`. `WebSite.url` is `https://www.eduairet.com/`. `Person.image` is `https://www.eduairet.com/eduardo-aire-torres.webp` (`PROFILE_PHOTO`). `Person.description` is the About text. `Person.jobTitle` is the home subtitle split on `·`.

`/en/projects` adds `CollectionPage`, `ItemList`, and `BreadcrumbList`. A project page adds `CreativeWork` and `BreadcrumbList`. Contact and privacy responses contain no `application/ld+json`.

Project pages use `CreativeWork`. The schema is shared by every project in `structuredData.utils.ts`.

## Sitemap and robots

`/sitemap.xml` lists 32 URLs. `curl -s http://127.0.0.1:3000/sitemap.xml | grep -c '<url>'` prints 32. That is 16 paths times 2 locales. Every URL has `lastmod`. The file has no `priority` and no `changefreq`.

`lastmod` is copied from `PAGES_UPDATED` and from each project's `updated` (`src/utils/constants/site.constants.ts` and `projects.constants.ts`). Those dates are written by hand. `sitemapRobots.test.ts` checks that the sitemap uses the constants. It does not check that a content edit changed the date.

`/robots.txt` allows `/`, disallows `/api/`, and points `Sitemap` at `https://www.eduairet.com/sitemap.xml`. The rule is `userAgent: '*'` in `src/app/robots.ts`.

`/en/feed.xml` and `/es/feed.xml` return 200 `application/rss+xml`.

## Redirects

`next.config.mjs` sends each of the 106 paths in `oldPortfolioPages.mjs` to the same path on `https://archive.eduairet.com` with status 308. Checked: `/36days-of-type-2019` goes to `https://archive.eduairet.com/36days-of-type-2019`.

`/resources`, `/en/resources`, and `/es/resources` return 308 to `https://archive.eduairet.com/resources`. The locale prefix is not kept.

`/home` returns 308 to `/`. `/about` returns 308 to `/#about`. `/work` returns 308 to `/projects`.

## Unknown URLs

Locale unknown URLs return 404, `noindex`, and `global-not-found.tsx`. Checked: `/en/does-not-exist`, `/es/does-not-exist`, `/en/projects/not-a-real-slug`, `/es/projects/not-a-real-slug`, `/en/contact/extra`, `/.well-known/test`, and `/api/nope`. The title is `Page not found | Eduardo Aire Torres`. Details are in the accessibility report, F-15.

`/wp-login.php` and `/not-a-page.html` return 404 and `noindex` from the Next default error shell. The title is `Eduardo Aire Torres`. `src/proxy.ts` skips paths that match `PUBLIC_FILE`.

`/fr` returns 302 to `/en/fr`. `/en/fr` is the global 404.

## Lighthouse SEO

On this environment `/en` and `/es` score 100 on SEO, mobile and desktop. The projects link reads `See all projects` in English and `Ver todos los proyectos` in Spanish. The project page scores 100. Numbers and the run method are in the Lighthouse report.
