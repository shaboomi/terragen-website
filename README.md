# TerraGen's website

A static site: Vite, plain HTML, CSS and TypeScript. No framework, no
trackers, no analytics, no third-party scripts; the fonts are served from the
site. Three pages: the home page, `privacy/` and `attribution/` (built from
`ATTRIBUTION.md`).

**Nothing is deployed.** The domain, the host, the shop and the installers do
not exist yet (`docs/07-M6-PLAN.md` step 37 and §4.5). Every address the site
is waiting for is in `links.ts`, each with a `TODO(REL-5)`; the price and the
update window in the comparison table are `£XX` and `XX` placeholders.

## Commands

- `pnpm -C site dev`: the dev server (port 5175; `.claude/launch.json` has it as `site`)
- `pnpm -C site build`: type-check and build into `site/dist/`
- `pnpm -C site test`: the palette's contrast check (WCAG AA for every colour pair; part of `cargo xtask ci`)
- `pnpm -C site a11y [--shots <folder>]`: build, then axe-core on every page at 360 px and 1280 px, with and without reduced motion
- `bash site/scripts/render.sh` (from the repository root), then `pnpm -C site images`: draw the pictures again

## Pictures

Every picture is TerraGen's own output, never stock art.

- The style wall is the golden picture of every built-in style (`testdata/golden/`), named from `styles/`.
- The larger pictures are drawn by the command line from the test files (`scripts/render.sh`, into the git-ignored `.render/`).
- `scripts/images.mjs` turns both into the WebP files in `public/img/` and the lists in `src/generated/`. Those are committed, so the site builds without the engine.

## How a page is put together

`vite.config.ts` holds a small plugin that fills each page in: the shared
header and footer (`partials/`), the style wall, each `<x-img>` (an `<img>`
with its `srcset`, `sizes`, width and height), the hero's stroke and the
attribution page. `src/styles.css` is the whole design; its colour tokens are
the ones `scripts/contrast.mjs` checks.
