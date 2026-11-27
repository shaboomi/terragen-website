import { marked } from "marked";
import type { Metadata } from "next";
import source from "@/generated/attribution.json";

// Not in Sanity: this page says what TerraGen's own record says.

export const metadata: Metadata = {
  title: "Attribution: TerraGen",
  description: "The open-source software, algorithms, models and fonts TerraGen is built on, with their licences.",
};

const INTRO = `
<p class="lede">
  TerraGen stands on other people's work: libraries, papers, models and typefaces.
  This page is built from the project's own record, <code>ATTRIBUTION.md</code>, so it
  says what the app's About dialog says. It is written for the people who build
  TerraGen, and names the files it speaks of.
</p>

<h2>This website</h2>
<ul>
  <li>
    <strong>Fjalla One</strong> (headings). Copyright 2012 The Fjalla Project Authors.
    <a href="/licences/fjalla-one-OFL.txt">SIL Open Font License 1.1</a>. Served from
    this site, from the <code>@fontsource/fjalla-one</code> package.
  </li>
  <li>
    <strong>Barlow</strong> (text). Copyright 2017 The Barlow Project Authors.
    <a href="/licences/barlow-OFL.txt">SIL Open Font License 1.1</a>. Served from this
    site, from the <code>@fontsource/barlow</code> package.
  </li>
  <li>
    <strong>The pictures</strong> are TerraGen's own output: the reference picture of
    every built-in style, and plots, mockups and a certificate made with the command
    line from the project's test files. None is a photograph or stock art.
  </li>
</ul>
`;

/**
 * ATTRIBUTION.md, as HTML. It is TerraGen's own file, copied into content/ by
 * `pnpm sync`, so its HTML is trusted.
 */
function attribution(): string {
  // The page has its own h1: drop the file's.
  const html = marked.parse(source.markdown.replace(/^# .*\n/, ""), { async: false, gfm: true });
  // A wide table scrolls in its own box, which a keyboard must be able to reach.
  let tables = 0;
  return html
    .replace(
      /<table>/g,
      () => `<div class="table-scroll" role="region" tabindex="0" aria-label="Table ${++tables}"><table>`,
    )
    .replace(/<\/table>/g, "</table></div>");
}

export default function AttributionPage() {
  return (
    <main id="main" className="page">
      <div className="wrap">
        <p className="eyebrow">Attribution</p>
        <h1>What TerraGen is built on</h1>
        {/* One block of HTML, so the file's parts sit directly in .prose, which spaces its children. */}
        <div className="prose prose--wide" dangerouslySetInnerHTML={{ __html: INTRO + attribution() }} />
      </div>
    </main>
  );
}
