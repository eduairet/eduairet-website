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
- **Pinned tooling:** GitHub Actions are pinned to commit SHAs, and pnpm to
  the `packageManager` version.
- **Auditing:** CI fails on any _critical_ advisory in production
  dependencies and reports the rest.
- **Automated updates:** Dependabot proposes dependency, Action, and Docker
  base image updates after a cooldown.
