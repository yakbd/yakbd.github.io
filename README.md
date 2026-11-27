# yakbd.github.io

The website of YAKBD at https://yakbd.github.io/: a landing page and the user documentation of the `yakbd` tool,
the YAKBD Editor and the `.kbl.json` format.

The documentation pages are not kept here. They live in their repositories,
[`yakbd/yakbd-cli`](https://github.com/yakbd/yakbd-cli), [`yakbd/kbl-gui`](https://github.com/yakbd/kbl-gui) and
[`yakbd/kbl-spec`](https://github.com/yakbd/kbl-spec),
and the build fetches them at the exact commits pinned in [`sources.json`](sources.json). To change a page, change
it in its repository, then update the commit in `sources.json`. Only the landing page
([`docs/.vitepress/theme/Landing.vue`](docs/.vitepress/theme/Landing.vue)) and the site configuration live here.

## Build

Node.js 22:

    npm ci
    npm run build             # fetch the pages, build with VitePress, check every internal link and heading
    npm run dev               # the same, served locally with live reload
    npm run check:external    # after a build: also request every external link once

Pushing to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/pages.yml`).

## Licence

MIT-0 (MIT No Attribution), see [`LICENSE`](LICENSE). The pages fetched from the other repositories carry their
own repositories' licence (MIT-0 as well).
