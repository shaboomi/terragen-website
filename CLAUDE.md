# TerraGen Website — Agent Guide

The marketing website for TerraGen (the studio for commercial pen-plotter art): a static site, Vite + plain HTML, CSS and TypeScript. No framework, no trackers, no analytics, no third-party scripts; fonts served from the site. `README.md` has the commands and how a page is put together.

## The TerraGen project (read-only)

The app lives in its own repository, checked out at `C:\Users\rmars\Documents\TerraGen` (`../TerraGen`; github.com/shaboomi/terraGen). This project's settings add it as a working directory so a session can read it, and deny edits to it. **Never change, commit, branch or run builds that write in the TerraGen checkout from here**: other sessions work there. The one exception is `bash scripts/render.sh`, which runs TerraGen's command line there to draw pictures into this repository's `.render/`.

Where to look in TerraGen, and read only what the task needs:
- **What the product does:** `docs/02-PRODUCT-SPEC.md` (§1 principles, §2 personas, §4 features by ID, §5 business model).
- **Free and Pro:** the "Free and Pro" bullet and the open questions in TerraGen's `CLAUDE.md`. Pro = the ML styles, Publish (`PUB-*`), the border, the CLI and the MCP server; opening, drawing, exporting and plotting are always free; no trial.
- **The website's plan:** `docs/07-M6-PLAN.md` §4.1.10 ("Website") and step 37 (`REL-5`); open questions in §4.5 (the shop, the price, the update window, the host and domain).
- **What has shipped lately:** the top of `docs/PROGRESS.md`.
- **Pictures:** `testdata/golden/` (every style's reference picture), `styles/` (names and categories), `docs/screenshots/`.
- **Credits:** `ATTRIBUTION.md` (copied here by `pnpm sync`).

## Rules
- **Every picture is TerraGen's own output**, never stock art, never AI-generated imagery. New pictures come from `scripts/render.sh` + `pnpm images`.
- **Honest copy only:** no invented testimonials, user counts, reviews or prices. The price and update window stay `£XX`/`XX` until the owner decides; each missing address is a `TODO(REL-5)` in `links.ts`.
- **The look was accepted by the owner (2026-11-17):** terraPen's family (dark ground, acid lime, hot pink, Fjalla One + Barlow) with the plotted sheet and cream paper as TerraGen's own part. Its colour and type tokens are in `src/styles.css`; `pnpm test` checks every colour pair at WCAG AA. Change the look only when asked.
- WCAG AA, `prefers-reduced-motion` respected, works from 360 px. Run `pnpm a11y` after a layout change.
- **Deploy nothing and buy nothing** without the owner's yes: the domain, host and shop are the owner's to set up. The web build at `/app` needs COOP and COEP headers.
- TS strict, no `any`. Commits `feat(REL-5): …` / `fix(REL-5): …`.

## Done means
`pnpm build`, `pnpm test` and `pnpm a11y` pass; `pnpm sync:check` passes (or `pnpm sync` was run); screenshots in the PR when the page changed.
