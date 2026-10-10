# SEO: eduairet-website

Every indexable page is prerendered with its metadata in `<head>`: a self-referencing canonical on `https://www.eduairet.com`, hreflang with `x-default`, Open Graph and X tags, and a sitemap entry. The home pages carry `WebSite` and `ProfilePage` structured data.

## Decisions

| Decision                                                                      | Why                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| English home canonical is `/en`, not `/`                                      | `/` redirects by language, so it must stay a 302. A 302 target can still be canonical "if other canonicalization signals are present" ([redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)). |
| `x-default` is the unprefixed path (`/` for home, `/contact` for contact)     | It redirects by language, which is what x-default is for ([localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)). Next writes the root without a trailing slash.           |
| `WebSite.url` is the domain root, on both `/en` and `/es`                     | Site names only work at the root, and duplicate home pages need the same markup ([site names](https://developers.google.com/search/docs/appearance/site-names)).                                                                |
| `Person.image` and `.description` come from the About section                 | Markup must describe what visitors see ([guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)).                                                                                        |
| All AI crawlers allowed; Vercel AI Bots ruleset on Log                        | Vercel's Deny would also block search and user-request fetchers.                                                                                                                                                                |
| Sitemap has no `lastmod`, `priority`, or `changefreq`                         | Google ignores the last two and needs `lastmod` to be accurate ([sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).                                                                |
| `favicon.ico` stays next to `icon.svg`                                        | Google doesn't support SVG favicons ([favicon](https://developers.google.com/search/docs/appearance/favicon-in-search)).                                                                                                        |
| `not-found.tsx` keeps its `<title>` element                                   | Only the root `app/not-found` can export metadata ([not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)).                                                                                          |
| Home descriptions are the pre-#31 text in both languages                      | Both results should say the same thing; Google showed the English one ([snippets](https://developers.google.com/search/docs/appearance/snippet)).                                                                               |
| Spanish home title is "Eduardo Aire Torres \| Ingeniero de Diseño y Producto" | 52 characters; the 65-character title was rewritten from the subtitle ([title links](https://developers.google.com/search/docs/appearance/title-link)).                                                                         |
| The home subtitle is inline text, not flex items                              | As flex items each word rendered as its own block, and Google joined them as "Ingeniero - de - Diseño".                                                                                                                         |
| Unmatched URLs get `app/global-not-found.tsx` (experimental flag)             | A full server-rendered 404 with `lang` and h1. `notFound()` calls and one-segment paths like `/wp-login.php` still use the layout 404.                                                                                          |
| The `/` redirect sends `Vary: Accept-Language`                                | Its target depends on that header ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-vary)).                                                                                                                          |

## Search Console baseline (2026-10-07)

- Indexed: `/`, `/en/contact`, `/es`.
- `/en`: duplicate of `/`, no user-declared canonical, found only through redirects.
- 404: `/indoctrinated-hound`, `/36days-of-type-2019` (now 308 to eduairet.myportfolio.com).
- Crawl stats, 90 days: 1,011 requests, 2.3% discovery, no 429s.

## PageSpeed

Before PR #31 (production, 2026-10-08): /en mobile 27, /es mobile 39, desktop timed out. Before `perf/lighthouse` (PSI, median of 3): mobile 48 on the home pages and 27 on contact, desktop 62 to 64 or timed out. After `perf/lighthouse` went live (PSI, median of 3): mobile 94 and 90 on the home pages, 96 and 100 on contact; desktop 100 on every page; Accessibility, Best Practices and SEO 100 everywhere. After PR #36 (2026-10-09): mobile /en 100 and /es 89, with Best Practices 96 on /en when Adobe Fonts timed out. Details, the final local numbers, and how to re-measure are in [lighthouse.md](../performance/lighthouse.md).

## How to check

On a production build:

- Fetch each route as a browser, Googlebot, facebookexternalhit, and Slackbot; metadata must be in `<head>`.
- `/en/does-not-exist`, `/es/does-not-exist`, `/en/resources` and `/wp-login.php` return 404 with noindex, not 200. A client Suspense boundary around page content turns them into 200s.
- `/` returns 302 with `Vary: Accept-Language`.
- For every URL in `/sitemap.xml`: 200, no noindex, self canonical, and the same hreflang set as the sitemap.
- POST the rendered `/en` and `/es` HTML to `https://validator.schema.org/validate`: 0 errors, 0 warnings.
- `pnpm test run` covers metadata, sitemap, robots, manifest, and JSON-LD.
