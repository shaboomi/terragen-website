# Prompt: the TerraGen website

Model: **Opus** (design-heavy). One PR, `feat(REL-5): …`. This is the design half of M6 step 37 (`REL-5`), done early: it needs no domain, host or shop, so it builds the site and deploys nothing. Start a new chat and paste everything below the line.

---

Use the **ui-ux-pro-max** skill (load it first and use its style, palette, font-pairing and UX-guideline searches) to design and build the marketing website for **TerraGen**, the studio for commercial pen-plotter art. Build it as a static site in a new top-level folder `site/` (Vite + plain HTML/CSS/TypeScript, no framework, no trackers, no analytics, no third-party scripts; fonts self-hosted). Do not touch the app, the engine or the docs other than `docs/PROGRESS.md`. Deploy nothing and buy nothing: the domain, host and shop don't exist yet, so the shop link, the downloads and the web build at `/app` are placeholders with a TODO each. Besides the home page, add the two pages the plan asks for: a privacy statement (the app makes no network call without opt-in, ML runs on the device) and an attribution page built from `ATTRIBUTION.md`.

**Read only:** `docs/07-M6-PLAN.md` §4.1.10's "Website" bullet, step 37 and open question 13 (branding); `docs/02-PRODUCT-SPEC.md` §1 (principles), §2 (personas), §4.8 (Publish) and §5 (business model); the "Free and Pro" bullet in `CLAUDE.md`. Don't read the other docs or the code.

**Audience:** three people at once — artists who sell work (editions, commissions, fairs, Etsy), hobbyists with a plotter who want a great plot tonight, and creative coders. It must look commercial and premium, like a product you pay for, but warm and made by plotter artists, not corporate SaaS.

**Influence: https://terrapen.xyz/** (study it in the browser pane; take its spirit, don't copy its layout or copy text). What to carry over:
- Dark ground `#111111`, light text `#EEEEEE`, acid-lime `#E5F15C` for bars and buttons, hot pink `#E83B68` for headings and accents.
- Headings in **Fjalla One**, uppercase, wide tracking (~0.15em); body in **Barlow** 500, 18px, slight tracking. Buttons uppercase, bold, very wide tracking.
- Big image-led sections, a short punchy tagline in the hero, an "Explore" call to action, a three-audience band, key-feature blocks, a journal strip.
Make TerraGen its own brand within that family (it is the software, terraPen is a machine it supports): run the palette through ui-ux-pro-max and add what it needs (a neutral for cards, a paper/cream for print-like sections, accessible contrast for every pair — check them).

**Show what it can do — every section uses real output, never stock art.** Pictures come from the repo: `testdata/golden/portrait/*.png` (82 styles drawn from one portrait), `testdata/golden/generative/*.png`, `testdata/golden/terrain/`, `docs/screenshots/` (the app). Make more with `cargo xtask terragen make … -o x.png` if a section needs it. Sections:
1. Hero: one striking plot, tagline (e.g. "From photo, code, map or sound to a signed, editioned print"), Download + Try in browser + See Pro.
2. Style carousel: a scrolling wall of the 82 styles (image-tone, generative, scripted, sources: terrain, maps, audio), hover shows the name.
3. How it works: the four stages — Create, Prepare, Plot, Publish.
4. Ink is the truth: preview at true pen width, ink-risk heatmap, time estimate, path optimisation, pen refresh.
5. Graph and code: node graph, fields, the code workspace, live sliders.
6. Plot: terraPen and FluidNC/GRBL machines, Wi-Fi upload, live progress, resume a stopped job; one G-code file per pen.
7. Publish (Pro): editions with numbered pieces, signature and title block, certificate of authenticity, proof sheets, framed mockups, CSV batch personalisation, costing and quotes, borders.
8. On-device ML (Pro): subject matte, depth, line maps — private, nothing leaves the computer.
9. Free vs Pro comparison table (from the `CLAUDE.md` Free and Pro bullet: opening, drawing, exporting and plotting are always free; Pro = ML styles, Publish, border, CLI, MCP, image analysis import). Price and update window are **not decided**: show `£XX` placeholders and leave a TODO, don't invent them. No trial.
10. Audiences band (artists / hobbyists / coders), journal placeholder, footer.

**Make people want Pro:** lead each Pro section with the outcome an artist sells ("a signed edition of 25, ready for the fair"), show the before/after (plot → framed mockup → certificate), put a Pro badge and one CTA on each, and repeat the Pro CTA after the comparison table. Honest copy only: no fake testimonials, user counts or reviews.

**Quality bar:** responsive from 360px, keyboard and screen-reader accessible (WCAG AA, check with axe), `prefers-reduced-motion` respected, images in WebP with sizes, Lighthouse ≥ 90 on all four scores. Subtle motion only (a line drawing itself in the hero is welcome).

**Verify frugally:** run the site with a `.claude/launch.json` entry and `preview_start`; one screenshot per section at desktop and one at mobile; read_page for text. Then update `docs/PROGRESS.md` (step 37's design done; the domain, host, shop and price still open), get `cargo xtask ci` green, open the PR with the screenshots, and stop. The website's look is an open branding question, so the PR asks the owner to accept it.
