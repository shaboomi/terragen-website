#!/usr/bin/env bash
# Draws the website's larger pictures with TerraGen itself, into .render/
# (git-ignored). `pnpm images` then turns them, and the golden pictures, into
# the WebP files the site ships (public/img/, committed).
#
# Run from this repository's root:  bash scripts/render.sh
# It runs TerraGen's command line in the TerraGen checkout (TERRAGEN_DIR, else
# ../TerraGen) and only reads that checkout: nothing there is changed.
# Every picture is real output: the reference portrait, the fixtures in
# testdata/ and the M5 demo edition. Nothing is plotted or uploaded.
set -euo pipefail

SITE=$(cd "$(dirname "$0")/.." && pwd)
TERRAGEN_DIR=${TERRAGEN_DIR:-$SITE/../TerraGen}
[ -f "$TERRAGEN_DIR/Cargo.toml" ] || { echo "no TerraGen checkout at $TERRAGEN_DIR (set TERRAGEN_DIR)" >&2; exit 1; }
OUT=$SITE/.render
cd "$TERRAGEN_DIR"
mkdir -p "$OUT"
T="cargo xtask terragen"
P=testdata/images/portrait-small.jpg
EDITION=testdata/demo/tidal-flow-edition.terragen
MACHINE=terrapen-a2-jackpot3

make() { # make <name.ext> <args…>
  local name=$1
  shift
  $T make "$@" -o "$OUT/$name" 2>&1 | tail -1
}

# Hero: one stroke, drawn by the page as a line.
make harmonograph.svg --style harmonograph

# Styles from the reference portrait.
for style in hedcut sketch cmy; do
  make "$style.png" "$P" --style "$style"
done
make flow-3-pens.png "$P" --style-file testdata/styles/flow-portrait-3-pens.json

# Ink is the truth: the same drawing with a 0.8 mm pen, without and with the
# ink risk heatmap.
make scribble-08.png "$P" --style scribble --pen-width 0.8
make scribble-08-heat.png "$P" --style scribble --pen-width 0.8 --heatmap

# Generative and scripted styles.
for style in noiserings turtletree wovenlines; do
  make "$style.png" --style "$style"
done

# Sources: a terrain and a sound.
make ridgelines.png --style ridgelines --heightmap testdata/terrain/synthetic.png
make spectrogram.png --style spectrogram --audio testdata/audio/etude.wav

# On-device ML: the depth map and line map fixtures, and what is drawn from them.
make relief.png "$P" --style relief --depth testdata/analysis/portrait.depth.png
make edges-ml.png "$P" --style edges --lines testdata/analysis/portrait.lines.png --set method=4

# Plot: one G-code file per pen.
mkdir -p "$OUT/gcode"
$T make "$P" --style cmy --machine "$MACHINE" -o "$OUT/gcode/portrait.g" 2>&1 | tail -4

# Publish: the M5 demo, a signed edition of 25.
$T edition piece "$EDITION" 1 -o "$OUT/piece-1.png" 2>&1 | tail -1
$T edition proof "$EDITION" -n 12 -o "$OUT/proof-sheet.png" 2>&1 | tail -1
$T mockup "$EDITION" -i 1 --format wall --frame oak --wall warm -o "$OUT/mockup-wall.png" 2>&1 | tail -1
$T mockup "$EDITION" -i 1 --format square --frame black --wall charcoal -o "$OUT/mockup-square.png" 2>&1 | tail -1
$T mockup "$EDITION" -i 7 --format portrait --frame walnut --wall sage -o "$OUT/mockup-portrait.png" 2>&1 | tail -1
rm -rf "$OUT/edition"
$T edition export "$EDITION" --machine "$MACHINE" -o "$OUT/edition" 2>&1 | tail -2

ls "$OUT"
