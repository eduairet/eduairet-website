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
- **Score-gated confirmation:** the visitor's confirmation goes out only when
  the reCAPTCHA score is at least 0.9 (`MIN_CONFIRMATION_SCORE` in
  `src/services/server/captcha.service.ts`). A pass is 0.5
  (`MIN_CAPTCHA_SCORE`). Every passing score gets the same response.
- **Strict input:** every field must be a non-empty string and the privacy
  notice box must be ticked, or the request gets a 400.
- **Rate limit:** not re-verified. A Vercel Firewall rule is not in this
  repository.
- **Reputation alarms:** not re-verified. CloudWatch alarms are not in this
  repository.
- **No stored AWS keys:** deployments trade Vercel's OIDC token
  (`x-vercel-oidc-token`) for AWS credentials that expire in 900 seconds
  (`STS_SESSION_SECONDS` in `src/utils/server/aws.utils.ts`). The role's
  permission boundary is not in this repository, so the claim that it may
  only send mail and write one table is not re-verified.

## What the form stores

Each message is also saved in a DynamoDB table, so it isn't lost if the email
goes missing. An item holds the name, email, message, language, time and
Vercel environment, plus an id and `expiresAt`. `expiresAt` is 90 days ahead
(`MESSAGE_RETENTION_SECONDS` in `src/services/server/email.service.ts`). It
holds no IP address and no reCAPTCHA token. DynamoDB TTL deletion is not
re-verified, because the table setting is not in this repository. Logs keep
only the status and the AWS error type, never what someone wrote.

If a save fails, the site emails me through SES with the reason, the time and
the Vercel environment, and nothing from the form. Runtime log retention on
Vercel Hobby is not re-verified, because it is not in this repository. The
[privacy notice](https://www.eduairet.com/en/privacy) explains all of this to
visitors.
