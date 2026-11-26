// Copies what this app shares with the repository root into places Next.js can
// read: the stylesheet, the pictures and their lists, the licences, the
// addresses and TerraGen's attribution file. The root's files stay the only
// source (`pnpm images`, `pnpm sync`, scripts/contrast.mjs); the copies are
// ignored by git. Runs before `npm run dev` and `npm run build`.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(web, "..");
const generated = join(web, "src", "generated");
const pub = join(web, "public");

const copy = (from, to) => cpSync(from, to, { recursive: true });

rmSync(generated, { recursive: true, force: true });
rmSync(join(pub, "img"), { recursive: true, force: true });
mkdirSync(generated, { recursive: true });
mkdirSync(join(pub, "fonts"), { recursive: true });

copy(join(root, "src", "generated"), generated);
copy(join(root, "content", "ATTRIBUTION.md"), join(generated, "ATTRIBUTION.md"));
copy(join(root, "links.ts"), join(generated, "links.ts"));
for (const name of ["img", "licences", "favicon.svg", "robots.txt"]) {
  copy(join(root, "public", name), join(pub, name));
}

// The fonts are served from this site: the stylesheet points at public/fonts/.
const FONT = /\/node_modules\/@fontsource\/([a-z-]+)\/files\/([a-z0-9-]+\.woff2)/g;
const css = readFileSync(join(root, "src", "styles.css"), "utf8").replace(FONT, (_, family, file) => {
  copy(join(web, "node_modules", "@fontsource", family, "files", file), join(pub, "fonts", file));
  return `/fonts/${file}`;
});
writeFileSync(join(generated, "styles.css"), css);
