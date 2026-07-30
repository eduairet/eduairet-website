# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
privately. **Do not open a public issue for security problems.**

- **Preferred:** open a [private security advisory](https://github.com/eduairet/eduairet-website/security/advisories/new)
  via GitHub (Security → Advisories → Report a vulnerability).
- **Email:** hola@eduairet.com

Please include enough detail to reproduce the issue (affected page or
dependency, steps, and impact). I'll acknowledge your report as soon as
possible and keep you updated on the fix.

## Supported Versions

This is a personal website deployed continuously from `main`. Only the latest
deployed version is supported; fixes are applied to `main`.

## Supply-chain hardening

This repository takes several measures to reduce supply-chain risk:

- **Install cooldown** — pnpm's `minimumReleaseAge` (see `pnpm-workspace.yaml`)
  blocks installing any dependency version published less than 7 days ago, so a
  freshly compromised release is not pulled in before it is detected.
- **Lifecycle-script lockdown** — package build/`postinstall` scripts are
  disabled by default via an explicit empty `onlyBuiltDependencies` allowlist.
- **Frozen lockfile** — CI and Docker installs use `--frozen-lockfile`, so only
  the exact, reviewed dependency tree is ever installed.
- **Pinned CI** — GitHub Actions are pinned to full commit SHAs, and the package
  manager is provisioned via Corepack from the `packageManager` pin.
- **Dependency auditing** — CI hard-fails on any *critical* advisory in the
  production dependency tree (`pnpm audit --prod --audit-level=critical`) and
  reports remaining advisories for visibility.
- **Automated updates** — Dependabot keeps dependencies, Actions, and the Docker
  base image current (with a cooldown mirroring the install policy).
