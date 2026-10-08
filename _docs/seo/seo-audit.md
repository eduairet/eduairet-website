# SEO: eduairet-website

Every indexable page is prerendered with its metadata in `<head>`: a self-referencing canonical on `https://www.eduairet.com`, hreflang with `x-default`, Open Graph and X tags, and a sitemap entry. The home pages carry `WebSite` and `ProfilePage` structured data.

## Decisions

| Decision                                                                  | Why                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| English home canonical is `/en`, not `/`                                  | `/` redirects by language, so it must stay a 302. A 302 target can still be canonical "if other canonicalization signals are present" ([redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)). |
| `x-default` is the unprefixed path (`/` for home, `/contact` for contact) | It redirects by language, which is what x-default is for ([localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)). Next writes the root without a trailing slash.           |
| `WebSite.url` is the domain root, on both `/en` and `/es`                 | Site names only work at the root, and duplicate home pages need the same markup ([site names](https://developers.google.com/search/docs/appearance/site-names)).                                                                |
| `Person.image` is the photo behind the logo                               | No placeholders, and markup must match what visitors see ([ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)).                                                                    |
| All AI crawlers allowed; Vercel AI Bots ruleset on Log                    | Vercel's Deny would also block search and user-request fetchers.                                                                                                                                                                |
| Sitemap has no `lastmod`, `priority`, or `changefreq`                     | Google ignores the last two and needs `lastmod` to be accurate ([sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).                                                                |
| `favicon.ico` stays next to `icon.svg`                                    | Google doesn't support SVG favicons ([favicon](https://developers.google.com/search/docs/appearance/favicon-in-search)).                                                                                                        |
| `not-found.tsx` keeps its `<title>` element                               | Only the root `app/not-found` can export metadata ([not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)).                                                                                          |

## Search Console baseline (2026-10-07)

- Indexed: `/`, `/en/contact`, `/es`.
- `/en`: duplicate of `/`, no user-declared canonical, found only through redirects.
- 404: `/indoctrinated-hound`, `/36days-of-type-2019` (now 308 to eduairet.myportfolio.com).
- Crawl stats, 90 days: 1,011 requests, 2.3% discovery, no 429s.

## How to check

On a production build:

- Fetch each route as a browser, Googlebot, facebookexternalhit, and Slackbot; metadata must be in `<head>`.
- For every URL in `/sitemap.xml`: 200, no noindex, self canonical, and the same hreflang set as the sitemap.
- POST the rendered `/en` and `/es` HTML to `https://validator.schema.org/validate`: 0 errors, 0 warnings.
- `pnpm test run` covers metadata, sitemap, robots, manifest, and JSON-LD.
