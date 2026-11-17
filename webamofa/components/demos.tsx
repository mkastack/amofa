"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "@/components/icons";
import { AbacusCloseup, BEAD_COUNT, EraserRender } from "@/components/renders";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AbacusDemo() {
  const [count, setCount] = useState(3);
  const [pivot, setPivot] = useState<number | null>(null);

  function update(next: number, from?: number) {
    const value = Math.max(0, Math.min(BEAD_COUNT, next));
    if (value === count) return;
    setPivot(from ?? (value > count ? BEAD_COUNT - value : BEAD_COUNT - count));
    setCount(value);
  }

  function pickBead(index: number) {
    const counted = index >= BEAD_COUNT - count;
    update(counted ? BEAD_COUNT - index - 1 : BEAD_COUNT - index, index);
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowRight: count + 1, ArrowUp: count + 1, ArrowLeft: count - 1, ArrowDown: count - 1, Home: 0, End: BEAD_COUNT };
    if (!(event.key in keys)) return;
    event.preventDefault();
    update(keys[event.key]);
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    const svg = event.currentTarget.querySelector("svg");
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 1000;
    const beadW = 56;
    const gap = 712 - BEAD_COUNT * beadW;
    for (let i = 0; i < BEAD_COUNT; i++) {
      const left = 144 + i * beadW + (i >= BEAD_COUNT - count ? gap : 0);
      if (x >= left - 4 && x <= left + beadW + 4) { pickBead(i); return; }
    }
  }

  return (
    <div className="demo demo-abacus">
      <div
        className="abacus-track"
        role="slider"
        tabIndex={0}
        aria-label="Abacus beads"
        aria-valuemin={0}
        aria-valuemax={BEAD_COUNT}
        aria-valuenow={count}
        aria-valuetext={`${count} of ${BEAD_COUNT} beads counted`}
        onKeyDown={onKey}
        onPointerDown={onPointer}
      >
        <AbacusCloseup count={count} delayFor={(i) => (pivot === null ? 0 : Math.abs(i - pivot) * 26)} />
      </div>
      <div className="demo-footer">
        <p className="abacus-count" aria-hidden="true">
          <span>{count}</span>
          <small>{count === 1 ? "bead counted" : "beads counted"}</small>
        </p>
        <div className="demo-controls">
          <button type="button" className="round-control" aria-label="Slide one bead back" disabled={count === 0} onClick={() => update(count - 1)}><Icon name="minus" /></button>
          <button type="button" className="round-control" aria-label="Count one more bead" disabled={count === BEAD_COUNT} onClick={() => update(count + 1)}><Icon name="plus" /></button>
          <button type="button" className="round-control" aria-label="Clear the count" disabled={count === 0} onClick={() => update(0)}><Icon name="reset" /></button>
        </div>
      </div>
    </div>
  );
}

const INK = "#1F3F9E";
const LINE_GAP = 40;

function scribble(ctx: CanvasRenderingContext2D, width: number) {
  let seed = 11;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const left = Math.min(84, width * 0.16) + 14;
  const right = width - 24;
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  [LINE_GAP * 3 - 1, LINE_GAP * 4 - 1].forEach((baseline, line) => {
    let x = left;
    const stop = line === 0 ? right : left + (right - left) * 0.58;
    while (x < stop - 40) {
      const letters = 2 + Math.floor(rand() * 4);
      const phase = rand() * 6;
      ctx.lineWidth = 2.3 + rand() * 0.5;
      ctx.beginPath();
      const steps = letters * 28;
      let endX = x;
      for (let s = 0; s <= steps; s++) {
        const t = (s / 28) * Math.PI * 2;
        const height = 11 + 13 * Math.abs(Math.sin(t * 0.31 + phase));
        const px = x + 3.4 * t + 6.2 * Math.sin(t);
        const py = baseline - 2 - (height / 2) * (1 - Math.cos(t));
        if (px > stop) break;
        if (s === 0) ctx.moveTo(px - 6, py + 1);
        ctx.lineTo(px, py);
        endX = px;
      }
      ctx.lineTo(endX + 7, baseline - 5);
      ctx.stroke();
      x = endX + 16 + rand() * 10;
    }
  });
}

function inkPixels(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !canvas.width || !canvas.height) return 0;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let total = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] > 40) total++;
  return total;
}

export function EraserDemo() {
  const paper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const baseInk = useRef(0);
  const width = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const frame = useRef<number | null>(null);
  const [cleared, setCleared] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const write = useCallback(() => {
    const surface = paper.current;
    const target = canvas.current;
    if (!surface || !target) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    const { width: w, height: h } = surface.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    target.width = Math.round(w * dpr);
    target.height = Math.round(h * dpr);
    const ctx = target.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    scribble(ctx, w);
    baseInk.current = inkPixels(target) || 1;
    width.current = w;
    setCleared(0);
  }, []);

  useEffect(() => {
    write();
    const surface = paper.current;
    if (!surface) return;
    const observer = new ResizeObserver(([entry]) => {
      if (Math.abs(entry.contentRect.width - width.current) > 1) write();
    });
    observer.observe(surface);
    return () => { observer.disconnect(); if (frame.current) cancelAnimationFrame(frame.current); };
  }, [write]);

  function erase(x: number, y: number) {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = 34;
    ctx.beginPath();
    const from = last.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
  }

  function measure() {
    if (!canvas.current) return;
    const left = inkPixels(canvas.current);
    setCleared(Math.min(100, Math.round((1 - left / baseInk.current) * 100)));
  }

  function point(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  function sweep() {
    const surface = paper.current;
    if (!surface) return;
    const { width: w } = surface.getBoundingClientRect();
    if (prefersReducedMotion()) {
      const ctx = canvas.current?.getContext("2d");
      if (ctx && canvas.current) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.current.width, canvas.current.height); ctx.restore(); }
      setCleared(100);
      return;
    }
    const rows = [LINE_GAP * 3 - 14, LINE_GAP * 4 - 14];
    const start = performance.now();
    const duration = 1500;
    last.current = null;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const row = p < 0.5 ? 0 : 1;
      const local = (p % 0.5) * 2;
      const x = 20 + local * (w - 40);
      const y = rows[row] + Math.sin(local * Math.PI * 9) * 12;
      if (row === 1 && p >= 0.5 && local < 0.02) last.current = null;
      erase(x, y);
      setCursor({ x, y });
      if (p < 1) frame.current = requestAnimationFrame(step);
      else { last.current = null; setCursor(null); measure(); }
    };
    frame.current = requestAnimationFrame(step);
  }

  const status = cleared >= 96 ? "Clean page." : `Ink cleared: ${cleared}%`;

  return (
    <div className="demo demo-eraser">
      <div
        className="ink-paper"
        ref={paper}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drawing.current = true; last.current = null; const p = point(event); erase(p.x, p.y); setCursor(p); }}
        onPointerMove={(event) => { const p = point(event); if (event.pointerType === "mouse" || drawing.current) setCursor(p); if (drawing.current) erase(p.x, p.y); }}
        onPointerUp={() => { drawing.current = false; last.current = null; measure(); }}
        onPointerCancel={() => { drawing.current = false; last.current = null; }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse" && !drawing.current) setCursor(null); }}
      >
        <canvas ref={canvas} role="img" aria-label="Lines of blue ink handwriting on ruled exercise-book paper. Drag across them to erase, or use the Erase for me button." />
        {cursor && (
          <div className="eraser-cursor" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true">
            <EraserRender />
          </div>
        )}
      </div>
      <div className="demo-footer">
        <p className="eraser-status" aria-live="polite">{status}</p>
        <div className="demo-controls">
          <button type="button" className="button button-secondary button-small" onClick={sweep} disabled={cleared >= 96}>
            <Icon name="eraser" />Erase for me
          </button>
          <button type="button" className="round-control" aria-label="Write the ink again" disabled={cleared === 0} onClick={write}><Icon name="reset" /></button>
        </div>
      </div>
    </div>
  );
}
