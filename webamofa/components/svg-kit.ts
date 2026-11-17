import { useId } from "react";

/* Shared drawing helpers for the concept renders. */

export type P = [number, number];

export function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

function channels(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mix a hex colour toward another by t (0–1). */
export function mix(hex: string, target: string, t: number) {
  const a = channels(hex);
  const b = channels(target);
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
export const lighten = (hex: string, t: number) => mix(hex, "#ffffff", t);
export const darken = (hex: string, t: number) => mix(hex, "#000000", t);

export const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
export const times = (a: P, k: number): P => [a[0] * k, a[1] * k];

export function poly(points: P[]) {
  return `M${points.map((p) => `${+p[0].toFixed(1)} ${+p[1].toFixed(1)}`).join(" L")} Z`;
}

/**
 * Box seen from the front and above (the eraser's projection):
 * u runs along the length, v runs toward the viewer, h drops straight down.
 * Visible faces: top, front (facing v), and the left end (facing -u).
 */
export function isoBox(o: P, u: P, v: P, h: number) {
  const down: P = [0, h];
  const a = o;
  const b = add(o, u);
  const c = add(b, v);
  const d = add(o, v);
  return {
    top: [a, b, c, d] as P[],
    front: [d, c, add(c, down), add(d, down)] as P[],
    end: [a, d, add(d, down), add(a, down)] as P[],
    base: [add(a, down), add(b, down), add(c, down), add(d, down)] as P[],
  };
}

/** Matrix that maps a flat local plane (x along u, y along v) onto a projected face. */
export function planeMatrix(o: P, u: P, v: P) {
  const lu = Math.hypot(u[0], u[1]);
  const lv = Math.hypot(v[0], v[1]);
  return { transform: `matrix(${u[0] / lu} ${u[1] / lu} ${v[0] / lv} ${v[1] / lv} ${o[0]} ${o[1]})`, width: lu, height: lv };
}

/** Rotation (degrees) of a vector, for text set on a vertical face. */
export function angleOf(u: P) {
  return (Math.atan2(u[1], u[0]) * 180) / Math.PI;
}
