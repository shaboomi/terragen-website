import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { defineConfig, type Plugin } from "vite";
import { LINKS } from "./links.ts";

// The site is plain HTML. This plugin is the whole "framework": it puts the
// shared header and footer into each page, and writes the parts that are
// lists of real things (the style wall, the pictures' sizes, the hero's
// stroke, the attribution page) from the files they come from.

const site = dirname(fileURLToPath(import.meta.url));

interface Style {
  id: string;
  name: string;
  category: string;
  group: string;
  src: string;
  width: number;
  height: number;
}

interface Picture {
  width: number;
  height: number;
  sources: { width: number; src: string }[];
}

const read = (path: string): string => readFileSync(resolve(site, path), "utf8");
const json = <T>(path: string): T => JSON.parse(read(path)) as T;

const escape = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ROWS = 3;

/** The wall: every built-in style, dealt into rows that scroll sideways. */
function wall(styles: Style[]): string {
  const rows: Style[][] = Array.from({ length: ROWS }, () => []);
  styles.forEach((style, i) => rows[i % ROWS]?.push(style));
  return rows
    .map((row, r) => {
      const tiles = row
        .map(
          (s) =>
            `<li class="tile"><img src="${s.src}" alt="" width="${s.width}" height="${s.height}" loading="lazy" decoding="async"><span class="tile__name">${escape(s.name)}<span class="vh">, ${escape(s.group.toLowerCase())}</span></span></li>`,
        )
        .join("");
      return `<div class="wall__row" role="group" tabindex="0" aria-label="Styles, row ${r + 1} of ${ROWS}. Scroll sideways for more."><ul>${tiles}</ul></div>`;
    })
    .join("\n");
}

/** `<x-img name="…" alt="…" sizes="…" [class="…"] [eager]>` becomes an `<img>` with its sizes. */
function images(html: string, pictures: Record<string, Picture>): string {
  return html.replace(/<x-img\s+([^>]*?)\s*\/?>/g, (_, raw: string) => {
    const attrs = Object.fromEntries(
      [...raw.matchAll(/([a-z-]+)(?:="([^"]*)")?/g)].map((m) => [m[1] ?? "", m[2] ?? ""]),
    );
    const name = attrs.name ?? "";
    const picture = pictures[name];
    if (!picture) throw new Error(`no picture called "${name}" (pnpm images)`);
    const widest = picture.sources[picture.sources.length - 1];
    if (!widest) throw new Error(`the picture "${name}" has no files`);
    const srcset = picture.sources.map((s) => `${s.src} ${s.width}w`).join(", ");
    const eager = "eager" in attrs;
    return [
      `<img src="${widest.src}" srcset="${srcset}" sizes="${attrs.sizes || "100vw"}"`,
      `width="${picture.width}" height="${picture.height}" alt="${attrs.alt ?? ""}"`,
      attrs.class ? `class="${attrs.class}"` : "",
      eager ? `fetchpriority="high" decoding="async">` : `loading="lazy" decoding="async">`,
    ]
      .filter(Boolean)
      .join(" ");
  });
}

/** The hero's plot: the harmonograph's one stroke, as the pen draws it. */
function hero(): string {
  const { viewBox, d } = json<{ viewBox: string; d: string }>("src/generated/hero.json");
  return `<svg class="hero-plot" viewBox="${viewBox}" role="img" aria-label="A harmonograph: one unbroken line looping into a figure of crossed ellipses."><path pathLength="1" d="${d}"/></svg>`;
}

/**
 * ATTRIBUTION.md, as the page. It is TerraGen's own file, copied into
 * content/ by `pnpm sync`, so its HTML is trusted.
 */
function attribution(): string {
  const text = readFileSync(resolve(site, "content", "ATTRIBUTION.md"), "utf8");
  // The page has its own h1: drop the file's.
  const body = text.replace(/^# .*\n/, "");
  const html = marked.parse(body, { async: false, gfm: true });
  // A wide table scrolls in its own box, which a keyboard must be able to reach.
  let tables = 0;
  return html
    .replace(
      /<table>/g,
      () => `<div class="table-scroll" role="region" tabindex="0" aria-label="Table ${++tables}"><table>`,
    )
    .replace(/<\/table>/g, "</table></div>");
}

/** The download buttons: a link when there is an address, a plain note when not. */
function downloads(): string {
  return Object.entries(LINKS.downloads)
    .map(([platform, url]) =>
      url
        ? `<li class="get__item"><h3>${platform}</h3><a class="btn btn--lime" href="${url}"><span>Download</span></a></li>`
        : `<li class="get__item"><h3>${platform}</h3><p class="get__soon">Not released yet</p></li>`,
    )
    .join("\n");
}

function pages(): Plugin {
  return {
    name: "terragen-site-pages",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const styles = json<Style[]>("src/generated/styles.json");
        const pictures = json<Record<string, Picture>>("src/generated/pictures.json");
        const count = (category: string): string =>
          String(styles.filter((s) => s.category === category).length);
        const filled = html
          .replace("<!--#header-->", () => read("partials/header.html"))
          .replace("<!--#footer-->", () => read("partials/footer.html"))
          .replace("<!--#wall-->", () => wall(styles))
          .replace("<!--#hero-->", () => hero())
          .replace("<!--#attribution-->", () => attribution())
          .replace("<!--#downloads-->", () => downloads())
          .replace(/\{\{styles\}\}/g, String(styles.length))
          .replace(/\{\{styles:([a-z-]+)\}\}/g, (_, category: string) => count(category))
          .replace(/\{\{shop\}\}/g, LINKS.shop ?? "/#buy")
          .replace(/\{\{app\}\}/g, LINKS.app);
        return images(filled, pictures);
      },
    },
    // A partial or a list changed: draw the page again.
    handleHotUpdate({ file, server }) {
      if (/[\\/](partials|generated)[\\/]/.test(file) || file.endsWith("ATTRIBUTION.md")) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}

export default defineConfig({
  plugins: [pages()],
  server: { port: 5175, strictPort: true },
  preview: { port: 4175, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        home: resolve(site, "index.html"),
        privacy: resolve(site, "privacy/index.html"),
        attribution: resolve(site, "attribution/index.html"),
      },
    },
  },
});
