# yakbd.github.io: agent instructions

The YAKBD website, https://yakbd.github.io/: VitePress 1.6, Node.js 22. It is the single place people read YAKBD
documentation; the READMEs of the other repositories are short and link here.

## Commands

```sh
npm ci
npm run build            # fetch the pinned pages, VitePress build, check every internal link and #heading
npm run dev              # the same, served with live reload
npm run check:external   # after a build: request every external link once (yakbd links must resolve)
```

`npm run build` must pass before every push. Pushing to `main` deploys (`.github/workflows/pages.yml`).

## Two kinds of page

| kind | where the text lives | examples |
|---|---|---|
| site page (guides for people) | here, `docs/**/*.md` and `docs/.vitepress/theme/Landing.vue` | `/`, `/guide/`, `/guide/quick-start`, `/guide/windows`, `/editor/`, `/spec/`, `/releases` |
| fetched page (reference tied to code) | another `yakbd/*` repository, fetched by `scripts/fetch-docs.mjs` at the commit pinned in `sources.json` | `/spec/format` = kbl-spec `SPEC.md`, `/cli/targets` = yakbd-cli `docs/targets.md` |

Fix a fetched page in its own repository, never in `docs/` here: the fetched files are git-ignored and overwritten
on every build. A footer on each fetched page names its source and commit.

## Where to look

| task | file |
|---|---|
| nav bar, sidebars, site title and description | `docs/.vitepress/config.mts` |
| landing page (hero, platform cards with today/planned tags, "Start here") | `docs/.vitepress/theme/Landing.vue` |
| colours, shared CSS (`.only-light`/`.only-dark` screenshots) | `docs/.vitepress/theme/custom.css` |
| fetched pages, pinned commits, fetched images | `sources.json` |
| link rewriting of fetched pages | `scripts/fetch-docs.mjs` |
| link and heading check | `scripts/check-links.mjs` |

## Re-pinning a repository (after it changed a fetched page)

1. Take the full commit sha from that repository (`git -C <clone> rev-parse HEAD`; for kbl-spec before 0.2 is on
   `main`, the head of `spec-0.2`).
2. Put it into `sources.json` → `repos.<name>`.
3. `npm run build`. A heading that was renamed in the source breaks links to it; the check names each one.

## Adding a page

- **Site page**: write `docs/<section>/<name>.md` with front matter `title:`, then add it to the sidebar in
  `config.mts` (`{ text, link }`). It is parsed with HTML and Vue on: keep `<placeholder>` and `{{ }}` inside
  backticks or code fences.
- **Fetched page**: add `{ "repo", "path", "out", "title" }` to `sources.json` → `pages`, add the line
  `docs/<out>` to `.gitignore` (the fetch script refuses an output that is not listed), then add `page("<out>")` to
  the sidebar in `config.mts`. Relative links inside the file become site links when their target is fetched too,
  otherwise GitHub links at the pinned commit.
- **Fetched image**: `sources.json` → `files` with `out: "public/images/<name>"`, plus the `.gitignore` line.

## Docs after every release (rule)

Each release of yakbd-cli, yakbd-gui or kbl-spec that adds, removes or changes functionality updates this site as
part of the release, so the site always matches the newest release:

- re-pin the released commits in `sources.json`;
- update or add the guide pages that describe the change (install, quick start, the platform guides, the editor
  page, `/spec/`), and add a short entry at the top of `docs/releases.md` (newest first, a few lines);
- update the platform cards in `Landing.vue` (`platforms`: `today` or `planned`) when a platform is added or moves.

## Conventions

- Release and download links always `https://github.com/yakbd/<repo>/releases/latest` and
  `releases/latest/download/<version-free name>`; the link check rejects tag links.
- Planned platforms say "planned", never a date. Only released functionality is "today" on `main`.
- Plain English, short sentences, no marketing words. One home per topic: link to a page instead of repeating it.
- Never link or mention private repositories. No Python. No `CLAUDE.md`: this file is the single source.
