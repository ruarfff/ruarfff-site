# Vendored anti-slop rules

- Source: https://github.com/dmmulroy/anti-slop
- Commit: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`
- Source directory: `skills/install-anti-slop/assets/anti-slop/`
- Installed directory: `tools/oxlint/anti-slop/`
- Installed through the Nix-managed `install-anti-slop` skill.

All 38 bundled files were compared byte-for-byte with the source archive at
this commit. No rule source was changed. This provenance document and the
upstream repository's MIT license are local additions. The nested Stylistic
license and provenance are preserved in `vendor/eslint-stylistic/`.

The generic entry point is enabled in `.oxlintrc.json`. The bundled Effect
entry point is not enabled because this project has no direct Effect dependency.
Oxlint and `@oxlint/plugins` are pinned together at `1.82.0`.

The vendored directory is excluded from application lint, formatting, and
TypeScript checks. Oxlint loads it through its JavaScript plugin runtime.
