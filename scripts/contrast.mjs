// Checks every colour pair the site uses against WCAG 2 contrast (AA):
// 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold) and for the
// edges of controls. Reads the tokens from src/styles.css, so the check is of
// the colours that ship. `pnpm contrast`; fails on a pair below its bar.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(fileURLToPath(new URL("../src/styles.css", import.meta.url)), "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2]]),
);

const TEXT = 4.5;
const LARGE = 3;

// [foreground, background, bar, where it is used]
const PAIRS = [
  ["text", "ground", TEXT, "body text on the dark ground"],
  ["text", "surface", TEXT, "body text on a card"],
  ["text", "surface-2", TEXT, "body text on a raised card"],
  ["muted", "ground", TEXT, "secondary text on the ground"],
  ["muted", "surface", TEXT, "secondary text on a card"],
  ["muted", "surface-2", TEXT, "secondary text on a raised card"],
  ["lime", "ground", TEXT, "eyebrows, links and ticks on the ground"],
  ["lime", "surface", TEXT, "eyebrows, links and ticks on a card"],
  ["lime", "surface-2", TEXT, "eyebrows and ticks on a raised card"],
  ["pink", "ground", TEXT, "headings and accents on the ground"],
  ["pink", "surface", LARGE, "headings (large) on a card"],
  ["pink-soft", "surface", TEXT, "small pink text on a card"],
  ["pink-soft", "surface-2", TEXT, "small pink text on a raised card"],
  ["pink-soft", "ground", TEXT, "small pink text on the ground"],
  ["ground", "lime", TEXT, "button and bar text on lime"],
  ["pink-deep", "lime", TEXT, "accent text on the lime bar"],
  ["ground", "pink", TEXT, "the Pro badge and Pro button text on pink"],
  ["ink", "paper", TEXT, "body text on paper"],
  ["ink", "paper-2", TEXT, "body text on a paper card"],
  ["ink-muted", "paper", TEXT, "secondary text on paper"],
  ["ink-muted", "paper-2", TEXT, "secondary text on a paper card"],
  ["pink-deep", "paper", TEXT, "headings and links on paper"],
  ["pink-deep", "paper-2", TEXT, "headings and links on a paper card"],
  ["ink", "sheet", TEXT, "title-block captions on a plotted sheet"],
  ["ink-muted", "sheet", TEXT, "secondary captions on a plotted sheet"],
  ["line-strong", "ground", LARGE, "control edges on the ground"],
  ["line-strong", "surface", LARGE, "control edges on a card"],
  ["ink-muted", "paper", LARGE, "control edges on paper"],
];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
for (const [fg, bg, bar, use] of PAIRS) {
  const a = tokens[fg];
  const b = tokens[bg];
  if (!a || !b) {
    console.error(`MISSING  --${!a ? fg : bg} is not a colour token in src/styles.css`);
    failed++;
    continue;
  }
  const ratio = contrast(a, b);
  const ok = ratio >= bar;
  if (!ok) failed++;
  console.log(
    `${ok ? "ok  " : "FAIL"}  ${ratio.toFixed(2).padStart(5)} (needs ${bar})  ${fg} ${a} on ${bg} ${b}: ${use}`,
  );
}
if (failed) {
  console.error(`\n${failed} pair(s) below their bar.`);
  process.exit(1);
}
console.log(`\n${PAIRS.length} pairs pass WCAG AA.`);
