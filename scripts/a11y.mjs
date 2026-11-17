// Builds the site, serves the build and runs axe-core (WCAG 2.2 A and AA) on
// every page at a phone's and a desktop's width, with and without reduced
// motion. `pnpm -C site a11y`; fails on any violation.
//
// With `--shots <folder>` it also saves a picture of each section of the home
// page at both widths (the pull request's screenshots).
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { build, preview } from "vite";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["/", "/privacy/", "/attribution/"];
const SIZES = [
  { name: "mobile", width: 360, height: 780 },
  { name: "desktop", width: 1280, height: 800 },
];
const SECTIONS = ["hero", "styles", "how", "ink", "graph", "plot", "publish", "ml", "pricing", "who", "journal", "download"];

const shotsAt = process.argv.indexOf("--shots");
const shots = shotsAt > 0 ? resolve(process.argv[shotsAt + 1] ?? "screenshots") : null;

await build({ root: site, logLevel: "warn" });
const server = await preview({ root: site, logLevel: "warn", preview: { port: 4175, strictPort: true } });
const origin = "http://localhost:4175";
const browser = await chromium.launch();
let violations = 0;

try {
  for (const size of SIZES) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        reducedMotion,
      });
      const page = await context.newPage();
      for (const path of PAGES) {
        await page.goto(origin + path, { waitUntil: "networkidle" });
        // Let the hero finish drawing itself, so axe sees the page at rest.
        await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finish())));
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (overflow > 0) {
          violations++;
          console.error(`FAIL  ${path} at ${size.width}px scrolls sideways by ${overflow}px`);
        }
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
          .analyze();
        for (const violation of result.violations) {
          violations++;
          console.error(`FAIL  ${path} at ${size.width}px (${reducedMotion}): ${violation.id}: ${violation.help}`);
          for (const node of violation.nodes.slice(0, 5)) console.error(`        ${node.target.join(" ")}`);
        }
        console.log(
          `${result.violations.length ? "FAIL" : "ok  "}  ${path} at ${size.width}px, motion ${reducedMotion}: ${result.passes.length} rules pass`,
        );
      }
      if (shots && reducedMotion === "no-preference") {
        mkdirSync(shots, { recursive: true });
        await page.goto(origin, { waitUntil: "networkidle" });
        // A picture of a section is taken in strips: keep the bar out of them,
        // and show the hero's plot as it ends.
        await page.addStyleTag({ content: ".bar { position: static; }" });
        await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finish())));
        for (const id of SECTIONS) {
          const section = page.locator(id === "hero" ? ".hero" : `#${id}`);
          await section.scrollIntoViewIfNeeded();
          // Lazy pictures load as the section comes into view.
          await section.evaluate(async (el) => {
            const images = [...el.querySelectorAll("img")].filter((img) => {
              const box = img.getBoundingClientRect();
              return box.left < window.innerWidth * 2;
            });
            images.forEach((img) => (img.loading = "eager"));
            await Promise.all(images.map((img) => img.decode().catch(() => undefined)));
          });
          await section.screenshot({ path: join(shots, `${size.name}-${id}.jpg`), type: "jpeg", quality: 80 });
        }
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  await new Promise((done) => server.httpServer.close(done));
}

if (violations) {
  console.error(`\n${violations} problem(s).`);
  process.exit(1);
}
console.log("\nNo accessibility violations.");
