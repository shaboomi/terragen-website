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

## The move to Sanity (not yet live)

`web/` is the same site in Next.js, with its copy in Sanity (project
`7s3gavgn`, dataset `production`); `studio/` is the Sanity Studio that edits
it. The static site described above is still the one that is deployed.

- Install: `pnpm --dir studio install --ignore-workspace` and `npm --prefix web install`
- `npm --prefix studio run dev`: the Studio (port 3333; the preview in `.claude/launch.json` uses 3334, also an allowed CORS origin)
- `npm --prefix web run dev`: the app (port 3000); first copy `web/.env.example` to `web/.env.local`
- `npm --prefix web run build`, `npm --prefix web run lint`
- `npm --prefix studio run typegen`: regenerate `web/sanity.types.ts` after a schema or query change
- In `studio/`, `npx sanity schemas deploy` after a schema change

In Sanity: the header, footer, home page copy, alternative text and privacy
statement. In the code: the pictures and the style wall, the code and file
samples, short interface labels, the addresses (`links.ts`) and the whole
attribution page. `web/scripts/assets.mjs` copies what the two sites share
(the stylesheet, pictures, licences, `links.ts`, `ATTRIBUTION.md`) from the
root before each build, so edit those at the root. Pages are set to
revalidate after a minute, so a published change should show soon after (not
yet tried end to end).

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
