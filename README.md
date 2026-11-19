# TerraGen's website

The website for [TerraGen](https://github.com/shaboomi/terraGen), the studio for
commercial pen-plotter art. It was built in TerraGen's repository as `site/`
(M6 step 37, `REL-5`) and moved here with its history on 2026-11-19.

A static site: Vite, plain HTML, CSS and TypeScript. No framework, no
trackers, no analytics, no third-party scripts; the fonts are served from the
site. Three pages: the home page, `privacy/` and `attribution/` (built from
TerraGen's `ATTRIBUTION.md`, copied into `content/`).

**Nothing is deployed.** The domain, the host, the shop and the installers do
not exist yet (TerraGen's `docs/07-M6-PLAN.md` step 37 and §4.5). Every address the site
is waiting for is in `links.ts`, each with a `TODO(REL-5)`; the price and the
update window in the comparison table are `£XX` and `XX` placeholders.

## Commands

- `pnpm install`, then `pnpm dev`: the dev server (port 5175; `.claude/launch.json` has it as `site`)
- `pnpm build`: type-check and build into `dist/`
- `pnpm test`: the palette's contrast check (WCAG AA for every colour pair)
- `pnpm a11y [--shots <folder>]`: build, then axe-core on every page at 360 px and 1280 px, with and without reduced motion
- `pnpm sync`: copy TerraGen's `ATTRIBUTION.md` into `content/` (`pnpm sync:check` says whether it is out of date)
- `bash scripts/render.sh`, then `pnpm images`: draw the pictures again

## TerraGen

The build needs nothing from TerraGen: the pictures (`public/img/`, `src/generated/`)
and `content/ATTRIBUTION.md` are committed. Only `pnpm sync`, `pnpm images` and
`scripts/render.sh` read a TerraGen checkout: `TERRAGEN_DIR`, else the sibling
folder `../TerraGen` (`scripts/terragen.mjs`). They never write to it.

## Pictures

Every picture is TerraGen's own output, never stock art.

- The style wall is the golden picture of every built-in style (`testdata/golden/`), named from `styles/`.
- The larger pictures are drawn by TerraGen's command line from its test files (`scripts/render.sh`, into the git-ignored `.render/`).
- `scripts/images.mjs` turns both into the WebP files in `public/img/` and the lists in `src/generated/`. Those are committed, so the site builds without the engine.

## How a page is put together

`vite.config.ts` holds a small plugin that fills each page in: the shared
header and footer (`partials/`), the style wall, each `<x-img>` (an `<img>`
with its `srcset`, `sizes`, width and height), the hero's stroke and the
attribution page. `src/styles.css` is the whole design; its colour tokens are
the ones `scripts/contrast.mjs` checks.
