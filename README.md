# Virtufin — `docs.virtufin.com`

The `virtufin/docs` repo publishes the main entry point for the
Virtufin documentation site at **[docs.virtufin.com](https://docs.virtufin.com/)**.

It is a content-only MkDocs (Material) site. There is no code
to build or test in this repo. The CI workflow builds MkDocs and
deploys the rendered HTML to GitHub Pages (`gh-pages` branch of
the `virtufin/docs` GitHub mirror).

## Layout

- `docs/v1/` — Markdown sources for the published site
- `docs/mkdocs_v1.yml` — MkDocs config (Material theme, indigo palette)
- `docs/CNAME` — Custom domain (`docs.virtufin.com`)
- `versions.env` — `API_VERSION=v1` (consumed by `docs-common.yaml`)
- `.github/workflows/docs.yaml` — Calls the shared `docs-common.yaml`

## The Virtufin platform

| Sub-site | Repo | Domain |
|----------|------|--------|
| API | `virtufin/virtufin-api` | `api.docs.virtufin.com` |
| WebSocketManager | `virtufin/virtufin-websocketmanager` | `websocketmanager.docs.virtufin.com` |
| WorkManager | `virtufin/virtufin-workmanager` | `workmanager.docs.virtufin.com` |
| OpenSpec | `virtufin/virtufin-openspec` | `specs.docs.virtufin.com` |

The shared build/deploy workflow is `virtufin-common/.github/workflows/docs-common.yaml`.

## Editing the site

1. Edit Markdown under `docs/v1/`.
2. Add Mermaid diagrams inside fenced ` ```mermaid ` blocks (Mermaid is loaded by
   `docs/v1/javascripts/mermaid-init.js`, pinned at v10.4.0).
3. Push to `master`. The `docs.yaml` workflow builds and deploys.

There is no version bump required for content-only changes — the
docs site is not a published package.
