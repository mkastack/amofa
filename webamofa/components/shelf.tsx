"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";

export function Shelf({ id, title, aside, children, className = "" }: { id: string; title: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const read = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    read();
    el.addEventListener("scroll", read, { passive: true });
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => { el.removeEventListener("scroll", read); observer.disconnect(); };
  }, [read]);

  function move(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section className={`shelf ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container shelf-head">
        <h2 className="shelf-title" id={`${id}-title`}>{title}</h2>
        {aside}
      </div>
      <div className="shelf-scroller" ref={scroller} role="list">
        {children}
      </div>
      <div className="container shelf-paddles">
        <button type="button" className="paddle" aria-label="Scroll back" disabled={edges.start} onClick={() => move(-1)}><Icon name="chevron" className="flip" /></button>
        <button type="button" className="paddle" aria-label="Scroll forward" disabled={edges.end} onClick={() => move(1)}><Icon name="chevron" /></button>
      </div>
    </section>
  );
}

export function ShelfItem({ children }: { children: ReactNode }) {
  return <div className="shelf-item" role="listitem">{children}</div>;
}
