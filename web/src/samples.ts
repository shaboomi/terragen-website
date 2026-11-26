// TerraGen's own output, shown as it is. Not content: it changes only when
// TerraGen's does, so it lives in the code and not in Sanity.

/** The whole script of Noise rings, one of the built-in styles. */
export const NOISE_RINGS = [
  "const rings = 36;    // min=3, max=100, step=1, How many rings\r",
  "const amount = 14;   // min=0, max=40, step=0.5, How far noise pushes a ring\r",
  "const grain = 1.1;   // min=0.2, max=3, step=0.05, Bumps round a ring\r",
  "const drift = 0.06;  // min=0, max=0.3, step=0.005, Change from ring to ring\r",
  "const hole = 0.12;   // min=0, max=0.6, step=0.01, Size of the empty middle\r",
  "const stretch = 1;   // min=0.4, max=1.6, step=0.05, Width against height\r",
  "\r",
  "const cx = page.x + page.width / 2;\r",
  "const cy = page.y + page.height / 2;\r",
  "const reach = Math.min(page.width, page.height) / 2 - 4 - amount;\r",
  "\r",
  "for (let i = 0; i < rings; i++) {\r",
  "  const base = reach * (hole + ((1 - hole) * (i + 1)) / rings);\r",
  "  const points = [];\r",
  "  for (let s = 0; s < 180; s++) {\r",
  "    const a = (s / 180) * 2 * Math.PI;\r",
  "    const n = noise(Math.cos(a) * grain + 20 + i * drift,\r",
  "                    Math.sin(a) * grain + 20 + i * drift);\r",
  "    const r = base + amount * n * (0.3 + (0.7 * (i + 1)) / rings);\r",
  "    points.push([cx + r * stretch * Math.cos(a), cy + r * Math.sin(a)]);\r",
  "  }\r",
  "  polyline(points, true);\r",
  "}",
].join("\n");

/** The start of the first G-code file of the three-pen sheet. */
export const GCODE = [
  "; TerraGen 0.1.0 - portrait-small\r",
  "; seed: 1\r",
  "; machine: terraPen A2 (Jackpot3)\r",
  "; paper: 210 x 297 mm at X0 Y0\r",
  "; pens: Yellow fineliner 0.3\r",
  "; bounds: X10 to X200, Y22.5 to Y272.5 (bed 594 x 420)\r",
  "; pen-down 20073 mm, pen-up 1933 mm, 231 lifts\r",
  "; estimated time: 11m 30s\r",
  "G21 ; mm\r",
  "G90 ; absolute\r",
  "G0 Z5\r",
  "; layer: Yellow (pen: Yellow fineliner 0.3)\r",
  "G0 X10 Y24.5\r",
  "G1 Z0 F1200\r",
  "G1 X200 Y24.5 F3000",
].join("\n");

/** What TerraGen wrote for the three-pen sheet. */
export const PEN_FILES = [
  "portrait-1-yellow-fineliner-0-3.g",
  "portrait-2-magenta-fineliner-0-3.g",
  "portrait-3-cyan-fineliner-0-3.g",
];

/** One piece of an edition's export set. */
export const EXPORT_FILES = [
  "01-of-25/01-of-25.svg",
  "01-of-25/01-of-25.json",
  "01-of-25/01-of-25-1-000000-0-3-mm.g",
  "01-of-25/01-of-25-2-title-block.g",
  "01-of-25/01-of-25-certificate.pdf",
  "01-of-25/01-of-25-certificate.svg",
  "edition.json",
];
