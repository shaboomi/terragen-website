"use client";

import { useEffect } from "react";

// The site's whole script: the menu on a small screen, and the style wall's
// slow drift. Everything on the page reads and works without it. The same
// behaviour as the static site's src/main.ts, undone when the page goes.

function menu(signal: AbortSignal): void {
  const button = document.querySelector<HTMLButtonElement>(".bar__menu");
  const nav = document.querySelector<HTMLElement>("#nav");
  if (!button || !nav) return;
  const set = (open: boolean): void => {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  };
  button.addEventListener("click", () => set(!nav.classList.contains("is-open")), { signal });
  nav.addEventListener(
    "click",
    (event) => {
      if ((event.target as Element).closest("a")) set(false);
    },
    { signal },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        set(false);
        button.focus();
      }
    },
    { signal },
  );
}

/** Pixels a second: slow enough to read a tile as it passes. */
const DRIFT = 14;

function wall(signal: AbortSignal): void {
  const root = document.querySelector<HTMLElement>("[data-wall]");
  const pause = document.querySelector<HTMLButtonElement>("[data-wall-pause]");
  const names = document.querySelector<HTMLButtonElement>("[data-wall-names]");
  if (!root) return;

  names?.addEventListener(
    "click",
    () => {
      const on = !root.classList.contains("wall--names");
      root.classList.toggle("wall--names", on);
      names.setAttribute("aria-pressed", String(on));
    },
    { signal },
  );

  const rows = [...root.querySelectorAll<HTMLElement>(".wall__row")].map((el, i) => ({
    el,
    // Rows drift opposite ways; the middle one starts from its far end.
    direction: i % 2 === 0 ? 1 : -1,
    position: 0,
  }));

  // Someone who asked for less motion gets rows to scroll by hand, and no
  // button that would start them moving. (Hidden, not removed: React owns it.)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !pause) {
    if (pause) pause.style.display = "none";
    return;
  }

  let paused = false; // by the button
  let held = false; // by a pointer or the keyboard being on the wall
  let visible = false;
  let last = 0;
  let frame = 0;

  for (const row of rows) {
    if (row.direction < 0) row.el.scrollLeft = row.el.scrollWidth;
    row.position = row.el.scrollLeft;
  }

  const step = (now: number): void => {
    const dt = Math.min(now - last, 100) / 1000;
    last = now;
    for (const row of rows) {
      const max = row.el.scrollWidth - row.el.clientWidth;
      if (max <= 0) continue;
      // Someone scrolled the row by hand: carry on from where they left it.
      if (Math.abs(row.el.scrollLeft - row.position) > 2) row.position = row.el.scrollLeft;
      row.position += row.direction * DRIFT * dt;
      if (row.position >= max) {
        row.position = max;
        row.direction = -1;
      } else if (row.position <= 0) {
        row.position = 0;
        row.direction = 1;
      }
      row.el.scrollLeft = row.position;
    }
    frame = requestAnimationFrame(step);
  };

  const sync = (): void => {
    const run = visible && !paused && !held && !document.hidden;
    if (run && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(step);
    } else if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  pause.addEventListener(
    "click",
    () => {
      paused = !paused;
      pause.textContent = paused ? "Play" : "Pause";
      sync();
    },
    { signal },
  );
  const hold = (on: boolean) => (): void => {
    held = on;
    sync();
  };
  root.addEventListener("pointerenter", hold(true), { signal });
  root.addEventListener("pointerleave", hold(false), { signal });
  root.addEventListener("focusin", hold(true), { signal });
  root.addEventListener("focusout", hold(false), { signal });
  document.addEventListener("visibilitychange", sync, { signal });
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    sync();
  });
  observer.observe(root);
  signal.addEventListener("abort", () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  });
}

export function Behaviour() {
  useEffect(() => {
    const controller = new AbortController();
    menu(controller.signal);
    wall(controller.signal);
    return () => controller.abort();
  }, []);
  return null;
}
