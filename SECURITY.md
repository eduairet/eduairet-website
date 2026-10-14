# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this project, please report it
privately. **Do not open a public issue for security problems.**

- **Preferred:** open a [private security advisory](https://github.com/eduairet/eduairet-website/security/advisories/new)
  via GitHub (Security → Advisories → Report a vulnerability).
- **Email:** hola@eduairet.com

Please include enough detail to reproduce the issue (affected page or
dependency, steps, and impact). I'll acknowledge your report as soon as
possible and keep you updated on the fix.

## Supported versions

This is a personal website deployed continuously from `main`. Only the latest
deployed version is supported; fixes are applied to `main`.

## Supply-chain hardening

- **Install cooldown:** `minimumReleaseAge` in `pnpm-workspace.yaml` blocks
  versions published less than 7 days ago, so a compromised release is caught
  before I install it.
- **No install scripts:** the empty `onlyBuiltDependencies` allowlist stops
  any dependency from running `postinstall` or build scripts.
- **Frozen lockfile:** CI and Docker install only the reviewed tree.
- **Pinned tooling:** GitHub Actions are pinned to commit SHAs, pnpm to
  the `packageManager` version, and the Vercel CLI to an exact version.
- **Auditing:** CI fails on any _critical_ advisory in production
  dependencies and reports the rest.
- **Automated updates:** Dependabot proposes dependency, Action, and Docker
  base image updates after a cooldown.

## Contact form abuse

The contact form sends me a copy of each message and may send the visitor a
fixed "thanks" email. These guards keep it from being used to email people
who never wrote to me:

- **CAPTCHA:** reCAPTCHA v3 must pass before anything is sent.
- **Score-gated confirmation:** the visitor's confirmation goes out only for
  the highest reCAPTCHA scores. Every passing score gets the same response.
- **Strict input:** every field must be a non-empty string, or the request
  gets a 400.
- **Rate limit:** a Vercel Firewall rule limits form sends per IP.
- **Reputation alarms:** CloudWatch emails me if the email bounce or
  complaint rate starts to climb, well before Amazon SES would act.
- **No stored AWS keys:** deployments trade Vercel's OIDC token for AWS
  credentials that expire in minutes, and that role may only send mail from
  my address.
