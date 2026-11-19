// Where the TerraGen checkout is. The website reads it (the golden pictures,
// the styles, ATTRIBUTION.md) and never writes to it.
//
// TERRAGEN_DIR if set, else the sibling folder ../TerraGen.
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");

export function terragen() {
  const dir = resolve(process.env.TERRAGEN_DIR ?? join(site, "..", "TerraGen"));
  if (!existsSync(join(dir, "Cargo.toml")) || !existsSync(join(dir, "ATTRIBUTION.md"))) {
    throw new Error(`no TerraGen checkout at ${dir} (set TERRAGEN_DIR)`);
  }
  return dir;
}
