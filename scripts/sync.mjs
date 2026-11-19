// Copies what the build reads from TerraGen into content/ (committed), so the
// site builds on a host that has no TerraGen checkout. `pnpm sync`; run it when
// TerraGen's ATTRIBUTION.md changes. `pnpm sync --check` fails if the copy is
// out of date.
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { terragen } from "./terragen.mjs";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = [["ATTRIBUTION.md", "content/ATTRIBUTION.md"]];
const check = process.argv.includes("--check");

let stale = 0;
for (const [from, to] of FILES) {
  const src = join(terragen(), from);
  const dst = join(site, to);
  if (check) {
    let same = false;
    try {
      same = readFileSync(src, "utf8") === readFileSync(dst, "utf8");
    } catch {}
    if (!same) {
      console.error(`${to} is out of date with TerraGen's ${from} (pnpm sync)`);
      stale++;
    }
  } else {
    copyFileSync(src, dst);
    console.log(`${from} -> ${to}`);
  }
}
process.exit(stale ? 1 : 0);
