// Makes the pictures the site ships: WebP files in public/img/ and the lists
// in src/generated/ that the pages are built from. Both are committed, so the
// site builds without this script; run it again (`pnpm images`) when a
// golden picture, a style or a render changes.
//
// Sources, all TerraGen's own output, read from the TerraGen checkout
// (`scripts/terragen.mjs`: TERRAGEN_DIR, else ../TerraGen):
//   - testdata/golden/**            the picture of every built-in style
//   - styles/**                     each style's name and category
//   - .render/                      larger renders (`bash scripts/render.sh`)
//   - docs/screenshots/, testdata/  the app's graph editor; the ML fixtures
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { terragen } from "./terragen.mjs";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = terragen();
const out = join(site, "public", "img");
const generated = join(site, "src", "generated");
const render = join(site, ".render");

// Fine lines cost bytes: 62 keeps a hairline clean at these sizes.
const QUALITY = 62;

// ---------------------------------------------------------------- the wall

// Where the golden picture of each style category lives.
const GOLDEN = {
  "image-tone": ["portrait"],
  generative: ["generative"],
  scripted: ["generative"],
  sources: ["terrain", "map", "audio", "mesh"],
};
const GROUPS = {
  "image-tone": "From a photo",
  generative: "Generative",
  scripted: "Scripted",
  sources: "From a source",
};

function styles() {
  const list = [];
  for (const category of Object.keys(GOLDEN)) {
    const dir = join(repo, "styles", category);
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const style = JSON.parse(readFileSync(join(dir, file), "utf8"));
      const golden = GOLDEN[category]
        .map((folder) => join(repo, "testdata", "golden", folder, `${style.id}.png`))
        .find((path) => existsSync(path));
      if (!golden) throw new Error(`no golden picture for the style ${style.id}`);
      list.push({ id: style.id, name: style.name, category, group: GROUPS[category], summary: style.summary, golden });
    }
  }
  return list;
}

// The wall mixes the categories: deal them out in proportion, so a row is
// never forty portraits in a line.
function dealt(list) {
  const piles = Object.keys(GOLDEN).map((category) => list.filter((s) => s.category === category));
  const total = list.length;
  const result = [];
  const taken = piles.map(() => 0);
  for (let i = 0; i < total; i++) {
    let best = 0;
    let bestLag = -Infinity;
    piles.forEach((pile, p) => {
      if (taken[p] >= pile.length) return;
      const lag = ((i + 1) * pile.length) / total - taken[p];
      if (lag > bestLag) {
        bestLag = lag;
        best = p;
      }
    });
    result.push(piles[best][taken[best]++]);
  }
  return result;
}

async function wall() {
  const dir = join(out, "styles");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const list = [];
  for (const style of dealt(styles())) {
    const image = sharp(style.golden);
    const { width, height } = await image.metadata();
    await image.webp({ quality: QUALITY, effort: 6 }).toFile(join(dir, `${style.id}.webp`));
    list.push({
      id: style.id,
      name: style.name,
      category: style.category,
      group: style.group,
      src: `/img/styles/${style.id}.webp`,
      width,
      height,
    });
  }
  writeFileSync(join(generated, "styles.json"), `${JSON.stringify(list, null, 2)}\n`);
  return list.length;
}

// ------------------------------------------------------------ the pictures

// name: [source, widths, crop?]. A crop is { left, top, width, height } in the
// source's pixels. The widest width is never wider than the source.
const R = (file) => join(render, file);
const PICTURES = {
  // From the reference portrait.
  "flow-3-pens": [R("flow-3-pens.png"), [420, 724]],
  hedcut: [R("hedcut.png"), [420, 724]],
  sketch: [R("sketch.png"), [420, 724]],
  cmy: [R("cmy.png"), [420, 724]],
  // Ink is the truth: the lower third of the sheet, where the ink is heaviest.
  "ink-plain": [R("scribble-08.png"), [480, 640], { left: 42, top: 600, width: 640, height: 360 }],
  "ink-heat": [R("scribble-08-heat.png"), [480, 640], { left: 42, top: 600, width: 640, height: 360 }],
  // Generative and scripted.
  noiserings: [R("noiserings.png"), [420, 724]],
  turtletree: [R("turtletree.png"), [420, 724]],
  wovenlines: [R("wovenlines.png"), [420, 724]],
  // Sources: a terrain and a sound.
  ridgelines: [R("ridgelines.png"), [420, 724]],
  spectrogram: [R("spectrogram.png"), [420, 724]],
  // On-device ML: the fixtures the goldens are drawn from, and the drawings.
  "ml-photo": [join(repo, "testdata", "images", "portrait-small.jpg"), [160]],
  "ml-subject": [join(repo, "testdata", "analysis", "portrait.subject.png"), [320, 480]],
  "ml-depth": [join(repo, "testdata", "analysis", "portrait.depth.png"), [320, 480]],
  "ml-lines": [join(repo, "testdata", "analysis", "portrait.lines.png"), [320, 480]],
  relief: [R("relief.png"), [420, 724]],
  "edges-ml": [R("edges-ml.png"), [420, 724]],
  // Publish: the M5 demo edition.
  "piece-1": [R("piece-1.png"), [420, 595]],
  "proof-sheet": [R("proof-sheet.png"), [480, 900]],
  certificate: [R("certificate.png"), [420, 800]],
  "mockup-wall": [R("mockup-wall.png"), [640, 1280, 1920]],
  "mockup-square": [R("mockup-square.png"), [420, 800]],
  "mockup-portrait": [R("mockup-portrait.png"), [420, 800]],
  // The app: the node graph with a field bound to a parameter (M2's screenshot,
  // cut to the graph editor; the bars round it have changed since).
  graph: [
    join(repo, "docs", "screenshots", "m2-graph-ui", "graph-and-field.png"),
    [480, 764],
    { left: 766, top: 128, width: 764, height: 736 },
  ],
};

async function pictures() {
  const dir = join(out, "pictures");
  mkdirSync(dir, { recursive: true });
  const listPath = join(generated, "pictures.json");
  // A picture whose source is not here (no render yet) keeps the files and
  // the entry it has.
  const list = existsSync(listPath) ? JSON.parse(readFileSync(listPath, "utf8")) : {};
  const skipped = [];
  for (const [name, [source, widths, crop]] of Object.entries(PICTURES)) {
    if (!existsSync(source)) {
      skipped.push(name);
      continue;
    }
    // A piece is drawn on a clear ground: put it on white paper.
    const base = crop ? sharp(source).extract(crop) : sharp(source);
    const buffer = await base.flatten({ background: "#ffffff" }).png().toBuffer();
    const { width, height } = await sharp(buffer).metadata();
    const sources = [];
    for (const w of widths.filter((w) => w <= width)) {
      const file = `${name}-${w}.webp`;
      await sharp(buffer).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(join(dir, file));
      sources.push({ width: w, src: `/img/pictures/${file}` });
    }
    list[name] = { width, height, sources };
  }
  const sorted = Object.fromEntries(Object.entries(list).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(listPath, `${JSON.stringify(sorted, null, 2)}\n`);
  return { made: Object.keys(PICTURES).length - skipped.length, skipped };
}

// ----------------------------------------------------------------- the hero

// The harmonograph is one stroke. The page draws it as a line, so its path is
// put in the page: every second point, to a tenth of a millimetre.
function hero() {
  const source = R("harmonograph.svg");
  if (!existsSync(source)) return false;
  const svg = readFileSync(source, "utf8");
  const paths = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  if (paths.length !== 1 || !viewBox) throw new Error("the harmonograph is no longer one stroke");
  const points = [...paths[0].matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const kept = points.filter((_, i) => i % 2 === 0 || i === points.length - 1);
  const d = `M${kept.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}`;
  writeFileSync(join(generated, "hero.json"), `${JSON.stringify({ viewBox, d })}\n`);
  return kept.length;
}

// The plottable certificate is an SVG in the export set: draw it as a picture.
async function certificate() {
  const dir = join(render, "edition");
  if (!existsSync(dir)) return;
  const piece = readdirSync(dir).filter((f) => f.startsWith("01-of-"))[0];
  if (!piece) return;
  const svg = readdirSync(join(dir, piece)).find((f) => /certificate.*\.svg$/.test(f));
  if (!svg) throw new Error(`no plottable certificate in ${piece}`);
  await sharp(join(dir, piece, svg), { density: 110 })
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(R("certificate.png"));
}

mkdirSync(generated, { recursive: true });
await certificate();
const tiles = await wall();
const { made, skipped } = await pictures();
const heroPoints = hero();
console.log(`wall: ${tiles} styles; pictures: ${made}; hero: ${heroPoints || "kept"} points`);
if (skipped.length) console.log(`kept as they are (no source here): ${skipped.join(", ")}`);
