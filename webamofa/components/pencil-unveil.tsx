"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * A scroll-driven "design review" of the AMOFA IQ Pencil™, modelled on the official
 * pencil mockup from the AMOFA brand guide: wireframe → clay → render sweep → detail →
 * exploded parts → final hero pair. Real geometry and materials in three.js.
 */

type Stage = { id: string; label: string; title: string; body: string; from: number; to: number };

const STAGES: Stage[] = [
  { id: "model", label: "Model", title: "It starts as a wireframe.", body: "Every edge of the AMOFA IQ Pencil™, modelled from the official design.", from: 0.04, to: 0.16 },
  { id: "clay", label: "Clay", title: "Then the form.", body: "A hexagonal barrel, a ferrule, an eraser, and a sharpened tip.", from: 0.16, to: 0.3 },
  { id: "render", label: "Render", title: "Navy lacquer. Gold detail.", body: "The finish from the AMOFA brand guide.", from: 0.3, to: 0.46 },
  { id: "detail", label: "Detail", title: "The abacus concept, printed on the barrel.", body: "Numbered dots and a unique code on every pencil.", from: 0.46, to: 0.64 },
  { id: "parts", label: "Parts", title: "Pre-sharpened, with an eraser.", body: "Ready to write the moment the box opens.", from: 0.64, to: 0.82 },
  { id: "final", label: "Final", title: "AMOFA IQ Pencil™.", body: "Write It, Own It.", from: 0.82, to: 1.01 },
];

const PARTS = [
  { key: "eraser", label: "Eraser" },
  { key: "ferrule", label: "Ferrule" },
  { key: "barrel", label: "Barrel with the AMOFA print" },
  { key: "wood", label: "Pre-sharpened wooden tip" },
  { key: "lead", label: "Writing core" },
] as const;
type PartKey = (typeof PARTS)[number]["key"];

/* Geometry (world units, pencil along +Y, eraser on top). Proportions follow the brand mockup (about 1:21). */
const R = 0.3; // barrel circumradius (hexagon) before slimming
const SLIM = 0.8; // cross-section scale; the barrel print is pre-stretched by 1/SLIM so it stays true
const BARREL_TOP = 3.93;
const BARREL_LEN = 7.4;
const BARREL_MID = BARREL_TOP - BARREL_LEN / 2;
const PART_Y: Record<PartKey, number> = { eraser: BARREL_TOP + 0.75, ferrule: BARREL_TOP + 0.27, barrel: BARREL_MID, wood: BARREL_TOP - BARREL_LEN - 0.475, lead: BARREL_TOP - BARREL_LEN - 0.95 - 0.11 };
const EXPLODE: Record<PartKey, number> = { eraser: 1.05, ferrule: 0.55, barrel: 0, wood: -0.6, lead: -1.05 };
const TIP_Y = PART_Y.lead - 0.11;
const TOP_Y = PART_Y.eraser + 0.27;
const PENCIL_LEN = TOP_Y - TIP_Y;
const FLOOR_Y = TIP_Y - 0.28;
const SWEEP = Math.max(TOP_Y, -TIP_Y) + 0.4;
const TAN2 = 2 * Math.tan((30 / 2) * (Math.PI / 180)); // visible height per unit of camera distance (fov 30)

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const window01 = (p: number, a: number, b: number, fade = 0.03) => smooth((p - a) / fade) * (1 - smooth((p - b + fade) / fade));

type Key = { p: number; v: number[] };
function track(keys: Key[], p: number): number[] {
  if (p <= keys[0].p) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (p <= b.p) { const t = smooth((p - a.p) / (b.p - a.p)); return a.v.map((x, j) => x + (b.v[j] - x) * t); }
  }
  return keys[keys.length - 1].v;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => { const img = new window.Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
}

/* The printed barrel, unwrapped: 6 hex faces across, barrel length down. Face 0 faces the camera. */
function barrelTexture(number: string, icon: HTMLImageElement, wordmark: HTMLImageElement) {
  const face = 160;
  const W = face * 6;
  const H = Math.round((BARREL_LEN / R) * face);
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#13203A"; g.fillRect(0, 0, W, H);
  // divider rings around the whole barrel
  g.fillStyle = "rgba(255,255,255,0.26)"; g.fillRect(0, 1000, W, 4); g.fillRect(0, 1018, W, 3);
  // Everything below is drawn in true proportions: x is centred on the front face and stretched by 1/SLIM,
  // which the slimmed geometry squeezes back.
  g.translate(face / 2, 0);
  g.scale(1 / SLIM, 1);
  // number + abacus dots (first dot gold), as on the mockup
  g.fillStyle = "#EEF1F6"; g.font = "700 92px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(number, 0, 232);
  for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(0, 392 + i * 112, 33, 0, Math.PI * 2); g.fillStyle = i === 0 ? "#E0A400" : "#E9ECF2"; g.fill(); }
  // unique code + wordmark + logo, reading upward like the mockup
  g.save(); g.translate(36, 1330); g.rotate(-Math.PI / 2); g.font = "600 54px Arial, sans-serif"; g.fillStyle = "#EEF1F6"; g.fillText("E24", 0, 0); g.restore();
  const wmH = 104, wmW = wmH * (wordmark.width / wordmark.height);
  g.save(); g.translate(-6, 1440 + wmW / 2); g.rotate(-Math.PI / 2); g.drawImage(wordmark, -wmW / 2, -wmH / 2, wmW, wmH); g.restore();
  const icH = 128, icW = icH * (icon.width / icon.height);
  g.save(); g.translate(-4, 1440 + wmW + 112); g.rotate(-Math.PI / 2 - 0.4); g.drawImage(icon, -icW / 2, -icH / 2, icW, icH); g.restore();
  // the gold swirl that wraps the barrel near the tip, drawn once per wrap so it crosses the texture seam cleanly
  const swH = 760, swW = swH * (icon.width / icon.height), around = W * SLIM;
  for (const shift of [-around, 0, around]) {
    g.save(); g.translate(30 + shift, H - 400); g.rotate(0.35); g.drawImage(icon, -swW / 2, -swH / 2, swW, swH); g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Soft contact shadow under the hero pair, like the brand mockup's floor ellipse. */
function blobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(2,8,20,0.9)");
  gr.addColorStop(0.5, "rgba(2,8,20,0.38)");
  gr.addColorStop(1, "rgba(2,8,20,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#D9AE76"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${150 + Math.random() * 40},${95 + Math.random() * 30},${50},${0.08 + Math.random() * 0.12})`; g.fillRect(Math.random() * 256, 0, 1 + Math.random() * 3, 256); }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Blender-style quad wireframe for any cylinder/cone: rings plus vertical edges. */
function quadWire(rTop: number, rBottom: number, height: number, radial: number, rings: number, thetaStart = 0) {
  const pts: number[] = [];
  const ringAt = (k: number) => { const t = k / rings; return { y: height / 2 - t * height, r: rTop + (rBottom - rTop) * t }; };
  const at = (r: number, a: number, y: number) => [r * Math.sin(a), y, r * Math.cos(a)];
  for (let k = 0; k <= rings; k++) {
    const { y, r } = ringAt(k);
    if (r < 1e-4) continue;
    for (let i = 0; i < radial; i++) { const a0 = thetaStart + (i / radial) * Math.PI * 2, a1 = thetaStart + ((i + 1) / radial) * Math.PI * 2; pts.push(...at(r, a0, y), ...at(r, a1, y)); }
  }
  for (let i = 0; i < radial; i++) {
    const a = thetaStart + (i / radial) * Math.PI * 2;
    pts.push(...at(rTop, a, height / 2), ...at(rBottom, a, -height / 2));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

type Built = {
  group: THREE.Group;
  parts: Record<PartKey, THREE.Group>;
  wire: THREE.LineBasicMaterial;
  clay: THREE.MeshStandardMaterial;
  finals: THREE.Material[];
  dispose: () => void;
};

function buildPencil(barrelMap: THREE.Texture, woodMap: THREE.Texture, withStages: boolean): Built {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  const wire = keep(new THREE.LineBasicMaterial({ color: 0x9ab8ff, transparent: true, opacity: 1 }));
  const clay = keep(new THREE.MeshStandardMaterial({ color: 0xa9afb9, roughness: 0.9, metalness: 0, transparent: true, opacity: 0 }));
  const mats = {
    barrel: keep(new THREE.MeshPhysicalMaterial({ map: barrelMap, roughness: 0.44, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.34, envMapIntensity: 0.38 })),
    ferrule: keep(new THREE.MeshStandardMaterial({ color: 0x17191d, metalness: 0.85, roughness: 0.3 })),
    eraser: keep(new THREE.MeshStandardMaterial({ color: 0x5a1d1c, roughness: 0.9, envMapIntensity: 0.6 })),
    wood: keep(new THREE.MeshStandardMaterial({ map: woodMap, roughness: 0.78 })),
    lead: keep(new THREE.MeshStandardMaterial({ color: 0x2a2b2f, metalness: 0.4, roughness: 0.42 })),
  };

  const parts = {} as Record<PartKey, THREE.Group>;
  const add = (key: PartKey, geo: THREE.BufferGeometry, wireGeo: THREE.BufferGeometry | null, mat: THREE.Material, extra?: (g: THREE.Group) => void) => {
    const g = new THREE.Group();
    g.position.y = PART_Y[key];
    g.add(new THREE.Mesh(keep(geo), mat));
    if (withStages) {
      g.add(new THREE.Mesh(geo, clay));
      if (wireGeo) g.add(new THREE.LineSegments(keep(wireGeo), wire));
    }
    extra?.(g);
    parts[key] = g;
    group.add(g);
  };

  // eraser: short cylinder + softened dome
  const eraserGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.36, 40, 1);
  add("eraser", eraserGeo, quadWire(0.27, 0.27, 0.36, 16, 2), mats.eraser, (g) => {
    const dome = new THREE.Mesh(keep(new THREE.SphereGeometry(0.27, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2)), mats.eraser);
    dome.scale.y = 0.32; dome.position.y = 0.18; g.add(dome);
    if (withStages) { const cd = new THREE.Mesh(dome.geometry, clay); cd.scale.y = 0.32; cd.position.y = 0.18; g.add(cd); }
  });
  // ferrule: round metal sleeve with crimped rings
  const ferruleGeo = new THREE.CylinderGeometry(0.305, 0.305, 0.56, 48, 1);
  add("ferrule", ferruleGeo, quadWire(0.305, 0.305, 0.56, 16, 4), mats.ferrule, (g) => {
    for (const y of [-0.17, -0.12, 0.12, 0.17]) {
      const ring = new THREE.Mesh(keep(new THREE.TorusGeometry(0.307, 0.013, 8, 56)), mats.ferrule);
      ring.rotation.x = Math.PI / 2; ring.position.y = y; g.add(ring);
    }
  });
  // barrel: hexagonal prism, a flat face toward +Z
  const barrelGeo = new THREE.CylinderGeometry(R, R, BARREL_LEN, 6, 24, false, -Math.PI / 6);
  add("barrel", barrelGeo, quadWire(R, R, BARREL_LEN, 6, 24, -Math.PI / 6), mats.barrel);
  // sharpened wood: round cone meeting the hexagon's flats (corners keep a painted scallop)
  const woodGeo = new THREE.CylinderGeometry(R * 0.87, 0.07, 0.95, 48, 1);
  add("wood", woodGeo, quadWire(R * 0.87, 0.07, 0.95, 16, 4), mats.wood);
  // writing core tip
  const leadGeo = new THREE.ConeGeometry(0.07, 0.22, 32);
  leadGeo.rotateX(Math.PI);
  add("lead", leadGeo, quadWire(0.07, 0.0, 0.22, 12, 2), mats.lead);

  group.scale.set(SLIM, 1, SLIM);
  return {
    group, parts, wire, clay,
    finals: Object.values(mats),
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}

export function PencilUnveil() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stageEls = useRef<(HTMLDivElement | null)[]>([]);
  const hudEls = useRef<(HTMLLIElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const ribbons = useRef<HTMLDivElement>(null);
  const labelWrap = useRef<HTMLDivElement>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const [mode, setMode] = useState<"loading" | "live" | "static" | "fallback">("loading");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cnv = canvas.current;
    const sec = section.current;
    if (!cnv || !sec) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cnv, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      queueMicrotask(() => setMode("fallback"));
      return;
    }
    let disposed = false;
    let frame = 0;
    let visible = false;
    let shown = reduce ? 1 : 0;
    const cleanups: (() => void)[] = [];

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.localClippingEnabled = true;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, 0.04).texture;
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 7, 6);
    scene.add(key);
    const rim = new THREE.SpotLight(0xffbe0e, 40, 30, 0.6, 0.6);
    rim.position.set(-5, 4, -6);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xbfd0ff, 0x0e1c34, 0.5));

    // Blender-style viewport floor: grid plus red X / green Y axis lines
    const grid = new THREE.GridHelper(40, 80, 0x3a5488, 0x203761);
    grid.position.y = FLOOR_Y;
    const gridMats = (Array.isArray(grid.material) ? grid.material : [grid.material]) as THREE.Material[];
    gridMats.forEach((m) => { m.transparent = true; });
    scene.add(grid);
    const axisGeo = new THREE.BufferGeometry();
    axisGeo.setAttribute("position", new THREE.Float32BufferAttribute([-20, FLOOR_Y + 0.002, 0, 20, FLOOR_Y + 0.002, 0, 0, FLOOR_Y + 0.002, -20, 0, FLOOR_Y + 0.002, 20], 3));
    axisGeo.setAttribute("color", new THREE.Float32BufferAttribute([0.88, 0.32, 0.31, 0.88, 0.32, 0.31, 0.5, 0.75, 0.25, 0.5, 0.75, 0.25], 3));
    const axisMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true });
    const axes = new THREE.LineSegments(axisGeo, axisMat);
    scene.add(axes);
    const blobMap = blobTexture();
    const shadowMat = new THREE.MeshBasicMaterial({ map: blobMap, transparent: true, opacity: 0, depthWrite: false });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.2), shadowMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = TIP_Y - 0.08;
    scene.add(floor);
    // render-sweep scanline
    const sweepMat = new THREE.MeshBasicMaterial({ color: 0xffbe0e, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const sweep = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.05), sweepMat);
    scene.add(sweep);

    const finalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -10);
    const clayPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);

    let A: Built | null = null;
    let B: Built | null = null;
    const rigA = new THREE.Group();
    const rigB = new THREE.Group();
    scene.add(rigA, rigB);

    const size = () => {
      const w = cnv.clientWidth, h = cnv.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 700 ? 1.5 : 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(size);
    ro.observe(cnv);
    size();

    const progress = () => {
      const r = sec.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span <= 0 ? 1 : clamp(-r.top / span);
    };

    const v3 = new THREE.Vector3();
    function apply(p: number) {
      if (!A || !B) return;
      const wide = camera.aspect >= 1;
      const portrait = camera.aspect < 0.8;
      // Exploded view lies eraser-right so the barrel print reads left to right.
      const HOR = wide ? -Math.PI / 2 : 0;
      const TURN = Math.PI * 2;
      const PAIR = wide ? 0.75 : 0.62;

      // pencil A: turntable, then front-facing for detail, exploded, then the hero pair
      const [rotY, rotZ, posX] = track([
        { p: 0, v: [-0.8, 0.95, 0] },
        { p: 0.16, v: [1.6, 0.8, 0] },
        { p: 0.3, v: [3.7, 0.5, 0] },
        { p: 0.46, v: [TURN, 0, 0] },
        { p: 0.64, v: [TURN, 0, 0] },
        { p: 0.7, v: [TURN - 0.45, HOR, wide ? 0 : -2.1] },
        { p: 0.82, v: [TURN - 0.45, HOR, wide ? 0 : -2.1] },
        { p: 0.9, v: [TURN - 0.22, 0, -PAIR] },
        { p: 1, v: [TURN - 0.22, 0, -PAIR] },
      ], p);
      rigA.rotation.set(0, 0, 0);
      rigA.rotateZ(rotZ);
      rigA.rotateY(rotY);
      rigA.position.set(posX, 0, 0);

      const explode = smooth((p - 0.66) / 0.07) * (1 - smooth((p - 0.79) / 0.06));
      for (const k of Object.keys(A.parts) as PartKey[]) A.parts[k].position.y = PART_Y[k] + EXPLODE[k] * explode;

      // pencil B rises in for the final pair
      const [bY, bOn] = track([{ p: 0.82, v: [-12, 0] }, { p: 0.92, v: [0, 1] }, { p: 1, v: [0, 1] }], p);
      rigB.visible = bOn > 0.01;
      rigB.position.set(PAIR, bY, 0);
      rigB.rotation.set(0, TURN + 0.22, 0);

      // stage materials
      const wireA = 1 - smooth((p - 0.16) / 0.06);
      A.wire.opacity = wireA;
      A.wire.visible = wireA > 0.01;
      const s = p < 0.3 ? 20 : p > 0.42 ? -20 : SWEEP - ((p - 0.3) / 0.12) * 2 * SWEEP;
      finalPlane.constant = -s;
      clayPlane.constant = s;
      A.clay.opacity = smooth((p - 0.16) / 0.06);
      A.clay.visible = p > 0.15 && p < 0.43;
      sweep.position.set(0, s, 0.6);
      sweep.lookAt(camera.position.x, s, camera.position.z);
      sweepMat.opacity = p > 0.3 && p < 0.42 ? 0.9 : 0;
      const gridA = 1 - smooth((p - 0.38) / 0.08);
      gridMats.forEach((m) => { m.opacity = gridA; });
      axisMat.opacity = gridA * 0.8;
      grid.visible = axes.visible = gridA > 0.01;
      shadowMat.opacity = smooth((p - 0.86) / 0.06) * 0.9;
      rim.intensity = 10 + 40 * smooth((p - 0.34) / 0.1);

      // camera path (cz is a minimum distance; wide shots are pushed back until the pencil fits)
      const [cx, cy, cz, tx, ty, tz] = track([
        { p: 0, v: [0, 2.4, 18, 0, 0, 0] },
        { p: 0.16, v: [2.6, 2.0, 14, 0, 0, 0] },
        { p: 0.3, v: [-1.6, 1.3, 12.5, 0, 0, 0] },
        { p: 0.46, v: [0, 0.9, 12, 0, 0.15, 0] },
        { p: 0.52, v: [0.7, BARREL_TOP - 0.57, 3.9, 0, BARREL_TOP - 0.85, 0] },
        { p: 0.57, v: [0.7, BARREL_TOP - 0.57, 3.9, 0, BARREL_TOP - 0.85, 0] },
        { p: 0.64, v: [0.75, 0.75, 4.6, 0, 0.5, 0] },
        { p: 0.7, v: [0, 0.4, 15.5, 0, 0, 0] },
        { p: 0.82, v: [0, 0.4, 15.5, 0, 0, 0] },
        { p: 0.92, v: [0, 0.6, 13.5, 0, 0.15, 0] },
        { p: 1, v: [0, 0.6, 13, 0, 0.15, 0] },
      ], p);
      // Frame inside the free area: below the nav + stage HUD, clear of the captions (which sit under the pencil on phones).
      const topR = portrait ? 0.17 : 0.15, botR = portrait ? 0.31 : 0.06;
      const sin = Math.abs(Math.sin(rotZ)), cos = Math.abs(Math.cos(rotZ));
      const len = PENCIL_LEN + 2.1 * explode;
      const spanH = len * cos + 0.55 * sin + 0.4;
      const spanW = len * sin + 0.55 * cos + 2 * PAIR * bOn + (portrait ? 5.2 * explode : 0);
      const fit = Math.max(spanH / (1 - topR - botR) / TAN2, spanW / (portrait ? 0.9 : 0.84) / (TAN2 * camera.aspect));
      const wideShot = smooth((cz - 6) / 4);
      const near = portrait ? 1.22 : 1; // phones: close-ups pull back so the dots clear the caption
      const base = cz * (near + (1 - near) * wideShot);
      const d = base + Math.max(0, fit - base) * wideShot;
      const k = d / cz;
      const pan = ((topR - botR) / 2) * TAN2 * d;
      camera.position.set(tx + (cx - tx) * k, ty + (cy - ty) * k + pan, tz + (cz - tz) * k);
      camera.lookAt(tx, ty + pan, tz);

      // HTML overlays
      if (intro.current) intro.current.style.opacity = String(1 - smooth((p - 0.02) / 0.05));
      STAGES.forEach((st, i) => {
        const el = stageEls.current[i];
        if (el) { const o = i === STAGES.length - 1 ? smooth((p - st.from) / 0.03) : window01(p, st.from, st.to); el.style.opacity = String(o); el.style.transform = `translateY(${(1 - o) * 12}px)`; el.setAttribute("aria-hidden", o < 0.5 ? "true" : "false"); }
        const hud = hudEls.current[i];
        if (hud) hud.classList.toggle("is-active", p >= st.from - 0.04 && p < st.to);
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (ribbons.current) ribbons.current.style.opacity = String(smooth((p - 0.84) / 0.08));
      const labelsOn = explode;
      const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
      // Landscape: labels alternate above/below the horizontal pencil. Narrow: all to the right of the upright pencil.
      labelWrap.current?.classList.toggle("is-side", !wide);
      PARTS.forEach((part, i) => {
        const el = labelEls.current[i];
        if (!el || !A) return;
        el.style.opacity = String(labelsOn);
        if (labelsOn < 0.01) return;
        const below = wide && i % 2 === 1;
        el.classList.toggle("is-below", below);
        v3.set(wide ? (below ? 0.34 : -0.34) : 0.34, A.parts[part.key].position.y, 0);
        rigA.localToWorld(v3);
        v3.project(camera);
        el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * w}px, ${(-v3.y * 0.5 + 0.5) * h}px)`;
      });
    }

    function render() {
      if (disposed) return;
      frame = 0;
      const target = reduce ? 1 : progress();
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const t = performance.now() / 1000;
      apply(shown);
      if (shown > 0.92) { rigA.position.y = Math.sin(t * 0.9) * 0.05; rigB.position.y += Math.sin(t * 0.9 + 1.4) * 0.05; }
      renderer.render(scene, camera);
      if (visible && !reduce) frame = requestAnimationFrame(render);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduce) frame = requestAnimationFrame(render);
    }, { rootMargin: "200px" });
    io.observe(sec);

    Promise.all([loadImage("/images/brand/logo-icon.png"), loadImage("/images/brand/logo-wordmark-white.png")]).then(([icon, wordmark]) => {
      if (disposed) return;
      const wood = woodTexture();
      const texA = barrelTexture("5", icon, wordmark);
      const texB = barrelTexture("10", icon, wordmark);
      A = buildPencil(texA, wood, true);
      B = buildPencil(texB, wood, false);
      A.finals.forEach((m) => { m.clippingPlanes = [finalPlane]; });
      A.clay.clippingPlanes = [clayPlane];
      rigA.add(A.group);
      rigB.add(B.group);
      cleanups.push(() => { A?.dispose(); B?.dispose(); texA.dispose(); texB.dispose(); wood.dispose(); });
      setMode(reduce ? "static" : "live");
      render();
    }).catch(() => setMode("fallback"));

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      cleanups.forEach((f) => f());
      grid.geometry.dispose(); gridMats.forEach((m) => m.dispose());
      axisGeo.dispose(); axisMat.dispose(); floor.geometry.dispose(); shadowMat.dispose(); blobMap.dispose();
      sweep.geometry.dispose(); sweepMat.dispose();
      scene.environment?.dispose(); pmrem.dispose(); room.dispose?.();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={section} className={`unveil unveil-${mode}`} id="unveil" aria-labelledby="unveil-title">
      <div className="unveil-sticky">
        <div className="unveil-ribbons" ref={ribbons} aria-hidden="true">
          <Image src="/images/brand/logo-icon.png" alt="" width={836} height={1000} className="ribbon ribbon-left" />
          <Image src="/images/brand/logo-icon.png" alt="" width={836} height={1000} className="ribbon ribbon-right" />
        </div>
        <canvas ref={canvas} className="unveil-canvas" aria-hidden="true" />
        {mode === "fallback" && (
          <div className="unveil-fallback-img">
            <Image src="/images/products/iq-pencil-card.jpg" alt="Two navy AMOFA IQ Pencils with the gold AMOFA mark and numbered abacus dots" width={1500} height={1200} sizes="(max-width: 833px) 100vw, 900px" />
          </div>
        )}
        <div className="unveil-intro" ref={intro}>
          <h2 id="unveil-title">The AMOFA IQ Pencil™, <span>unveiled.</span></h2>
          <p>Scroll to take it from first wireframe to final render.</p>
        </div>
        <div className="unveil-hud">
          <ol aria-label="Design review stages">
            {STAGES.map((st, i) => <li key={st.id} ref={(el) => { hudEls.current[i] = el; }}>{st.label}</li>)}
          </ol>
          <span className="unveil-bar" aria-hidden="true"><span ref={bar} /></span>
        </div>
        <div className="unveil-captions">
          {STAGES.map((st, i) => (
            <div className="unveil-caption" key={st.id} ref={(el) => { stageEls.current[i] = el; }}>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
              {st.id === "final" && <a className="unveil-cta" href="#buy">Get the IQ Pencil™</a>}
            </div>
          ))}
        </div>
        <div className="unveil-labels" ref={labelWrap} aria-hidden="true">
          {PARTS.map((part, i) => <div className="unveil-label" key={part.key} ref={(el) => { labelEls.current[i] = el; }}><span>{part.label}</span></div>)}
        </div>
        <a className="unveil-skip" href="#after-unveil">Skip the unveiling</a>
      </div>
      <span id="after-unveil" />
    </section>
  );
}
