import Image from "next/image";
import { useId, type CSSProperties, type ReactNode } from "react";
import type { Product, ProductArt } from "@/lib/products";
import { ColourPencilsRender, CrayonsRender, ExerciseBookRender, GeometrySetRender, HbPencilsRender, MathsBookRender, PencilCaseRender, RulerRender, SharpenerRender } from "@/components/catalog-renders";

/*
 * Concept renders drawn for the preview. They are not product photographs;
 * every page that shows them links to footnote 2.
 */

export const BEAD_COUNT = 10;

function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

function PencilDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-barrel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7C9EE4" />
        <stop offset=".1" stopColor="#8DABE9" />
        <stop offset=".25" stopColor="#5D84D6" />
        <stop offset=".25" stopColor="#3C68C8" />
        <stop offset=".5" stopColor="#315CBB" />
        <stop offset=".75" stopColor="#2A52A8" />
        <stop offset=".75" stopColor="#21448F" />
        <stop offset="1" stopColor="#163170" />
      </linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#BCC2CA" />
        <stop offset=".22" stopColor="#FFFFFF" />
        <stop offset=".5" stopColor="#D3D7DD" />
        <stop offset=".8" stopColor="#9DA3AD" />
        <stop offset="1" stopColor="#7B818C" />
      </linearGradient>
      <linearGradient id={`${id}-eraser`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E6E0D7" />
        <stop offset=".28" stopColor="#FBF9F5" />
        <stop offset="1" stopColor="#C6BEB1" />
      </linearGradient>
      <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F7E4C6" />
        <stop offset=".5" stopColor="#EAC795" />
        <stop offset="1" stopColor="#C58F55" />
      </linearGradient>
      <linearGradient id={`${id}-lead`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#71757C" />
        <stop offset=".5" stopColor="#3A3D43" />
        <stop offset="1" stopColor="#1E2024" />
      </linearGradient>
      <linearGradient id={`${id}-bead-light`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".45" stopColor="#F3F0EA" />
        <stop offset="1" stopColor="#B7AFA2" />
      </linearGradient>
      <linearGradient id={`${id}-bead-sun`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE08C" />
        <stop offset=".4" stopColor="#F4B841" />
        <stop offset="1" stopColor="#B57514" />
      </linearGradient>
      <linearGradient id={`${id}-bead-edge`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#14141E" stopOpacity=".3" />
        <stop offset=".24" stopColor="#14141E" stopOpacity="0" />
        <stop offset=".76" stopColor="#14141E" stopOpacity="0" />
        <stop offset="1" stopColor="#14141E" stopOpacity=".3" />
      </linearGradient>
      <filter id={`${id}-soft`} x="-20%" y="-120%" width="140%" height="340%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );
}

function Bead({ id, x, y, w, h, tone, style }: { id: string; x: number; y: number; w: number; h: number; tone: "light" | "sun"; style?: CSSProperties }) {
  const r = w * 0.46;
  return (
    <g className="bead" style={style}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}-bead-${tone})`} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}-bead-edge)`} />
      <rect x={x + w * 0.24} y={y + h * 0.09} width={w * 0.26} height={h * 0.2} rx={w * 0.13} fill="#fff" opacity=".6" />
    </g>
  );
}

/** Full pencil, drawn along a local x-axis and rotated into place. */
export function PencilRender({ angle = -30, count = 4, className = "" }: { angle?: number; count?: number; className?: string }) {
  const id = useSvgId();
  const beadW = 31;
  const rod0 = 252;
  const rod1 = 648;
  const gap = rod1 - rod0 - BEAD_COUNT * beadW;
  const place = `translate(500 330) rotate(${angle}) translate(-500 0)`;
  return (
    <svg className={`render render-pencil ${className}`} viewBox="0 0 1000 700" aria-hidden="true" focusable="false">
      <PencilDefs id={id} />
      <g transform={`translate(500 372) rotate(${angle}) translate(-500 0)`} opacity=".2" filter={`url(#${id}-soft)`}>
        <rect x="20" y="-28" width="970" height="56" rx="28" fill="#24272B" />
      </g>
      <g transform={place}>
        <path d="M850 -32 L966 -9 L966 9 L850 32 Z" fill={`url(#${id}-wood)`} />
        <path d="M884 -19 L958 -5 M890 14 L958 4" stroke="#B9824A" strokeOpacity=".28" strokeWidth="1.5" />
        <path d="M966 -9 L1000 0 L966 9 Z" fill={`url(#${id}-lead)`} />
        <rect x="116" y="-32" width="126" height="64" fill={`url(#${id}-barrel)`} />
        <path d="M664 -32 H858 Q878 -24 858 -16 Q892 0 858 16 Q878 24 858 32 H664 Z" fill={`url(#${id}-barrel)`} />
        <rect x="116" y="-27" width="126" height="3" fill="#fff" opacity=".32" />
        <rect x="664" y="-27" width="192" height="3" fill="#fff" opacity=".32" />
        <rect x={rod0} y="-6" width={rod1 - rod0} height="12" fill={`url(#${id}-metal)`} />
        <rect x="238" y="-35" width="14" height="70" rx="3" fill={`url(#${id}-metal)`} />
        <rect x="648" y="-35" width="16" height="70" rx="3" fill={`url(#${id}-metal)`} />
        {Array.from({ length: BEAD_COUNT }, (_, i) => (
          <Bead key={i} id={id} x={rod0 + i * beadW + (i >= BEAD_COUNT - count ? gap : 0)} y={-44} w={beadW} h={88} tone={i < 5 ? "light" : "sun"} />
        ))}
        <path d="M50 -30 H24 Q2 -30 2 -8 V8 Q2 30 24 30 H50 Z" fill={`url(#${id}-eraser)`} />
        <rect x="46" y="-34" width="74" height="68" rx="4" fill={`url(#${id}-metal)`} />
        <path d="M57 -34 V34 M63 -34 V34 M103 -34 V34 M109 -34 V34" stroke="#7B818C" strokeOpacity=".5" strokeWidth="2" />
        <path d="M59 -34 V34 M65 -34 V34 M105 -34 V34 M111 -34 V34" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" />
        <text className="render-wordmark" x="704" y="7.5" fontSize="21" fill="#fff" fillOpacity=".93">amofa</text>
      </g>
    </svg>
  );
}

/**
 * Close-up of the bead section. Counted beads sit on the right.
 * `delayFor` lets the interactive demo stagger bead motion.
 */
export function AbacusCloseup({ count, delayFor, className = "" }: { count: number; delayFor?: (index: number) => number; className?: string }) {
  const id = useSvgId();
  const beadW = 56;
  const rod0 = 144;
  const rod1 = 856;
  const gap = rod1 - rod0 - BEAD_COUNT * beadW;
  return (
    <svg className={`render render-closeup ${className}`} viewBox="0 0 1000 300" aria-hidden="true" focusable="false">
      <PencilDefs id={id} />
      <rect x="0" y="232" width="1000" height="22" rx="11" fill="#24272B" opacity=".14" filter={`url(#${id}-soft)`} />
      <rect x="-10" y="86" width="132" height="128" fill={`url(#${id}-barrel)`} />
      <rect x="878" y="86" width="132" height="128" fill={`url(#${id}-barrel)`} />
      <rect x="-10" y="96" width="132" height="5" fill="#fff" opacity=".3" />
      <rect x="878" y="96" width="132" height="5" fill="#fff" opacity=".3" />
      <rect x={rod0} y="138" width={rod1 - rod0} height="24" fill={`url(#${id}-metal)`} />
      <rect x="118" y="80" width="28" height="140" rx="6" fill={`url(#${id}-metal)`} />
      <rect x="854" y="80" width="28" height="140" rx="6" fill={`url(#${id}-metal)`} />
      {Array.from({ length: BEAD_COUNT }, (_, i) => {
        const counted = i >= BEAD_COUNT - count;
        return (
          <Bead
            key={i}
            id={id}
            x={rod0 + i * beadW}
            y={62}
            w={beadW}
            h={176}
            tone={i < 5 ? "light" : "sun"}
            style={{ transform: `translateX(${counted ? gap : 0}px)`, transitionDelay: `${delayFor?.(i) ?? 0}ms` }}
          />
        );
      })}
    </svg>
  );
}

/** Ink-cleaning eraser: a sleeved block seen from the front and above. */
const ERASER_TONES = {
  ink: { top: ["#EEF1F6", "#D8DFEA"], front: ["#C5CEDC", "#A8B4C8"], end: "#CBD3E0", frontEdge: "#B8C3D4", topEdge: "#E3E8F0", grit: "#5E6B82", sleeve: ["#3B67C6", "#264C9F"], sleeveTop: "#4A74D0" },
  soft: { top: ["#FDFCFA", "#EFEBE4"], front: ["#E6E1D8", "#D3CCC0"], end: "#E9E5DD", frontEdge: "#DCD6CB", topEdge: "#F4F1EC", grit: "#8C8578", sleeve: ["#3A3E45", "#24272B"], sleeveTop: "#4A4F57" },
} as const;

export function EraserRender({ className = "", tone = "ink" }: { className?: string; tone?: keyof typeof ERASER_TONES }) {
  const id = useSvgId();
  const t = ERASER_TONES[tone];
  return (
    <svg className={`render render-eraser ${className}`} viewBox="70 70 460 280" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-grit`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="2" r=".7" fill={t.grit} opacity=".22" />
          <circle cx="5" cy="5.5" r=".6" fill={t.grit} opacity=".16" />
        </pattern>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.top[0]} />
          <stop offset="1" stopColor={t.top[1]} />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.front[0]} />
          <stop offset="1" stopColor={t.front[1]} />
        </linearGradient>
        <linearGradient id={`${id}-sleeve`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.sleeve[0]} />
          <stop offset="1" stopColor={t.sleeve[1]} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>
      <path d="M112 256 L420 196 L494 251 L182 312 Z" fill="#24272B" opacity=".22" filter={`url(#${id}-soft)`} />
      <g strokeLinejoin="round" strokeWidth="12">
        <path d="M110 170 L180 225 L180 297 L110 242 Z" fill={t.end} stroke={t.end} />
        <path d="M180 225 L490 165 L490 237 L180 297 Z" fill={`url(#${id}-front)`} stroke={t.frontEdge} />
        <path d="M110 170 L420 110 L490 165 L180 225 Z" fill={`url(#${id}-top)`} stroke={t.topEdge} />
      </g>
      <path d="M180 225 L490 165 L490 237 L180 297 Z" fill={`url(#${id}-grit)`} />
      <path d="M110 170 L420 110 L490 165 L180 225 Z" fill={`url(#${id}-grit)`} />
      <path d="M176 226 L490 165" stroke="#fff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" />
      <path d="M220 145 L360 118 L431 174 L290 201 Z" fill={t.sleeveTop} />
      <path d="M290 201 L431 174 L431 249 L290 276 Z" fill={`url(#${id}-sleeve)`} />
      <path d="M290 201 L431 174" stroke="#fff" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
      <text className="render-wordmark" x="360" y="236" fontSize="30" fill="#fff" textAnchor="middle" transform="rotate(-10.95 360 226)">amofa</text>
    </svg>
  );
}

export function CollectionRender({ className = "" }: { className?: string }) {
  return (
    <div className={`render-collection ${className}`} aria-hidden="true">
      <PencilRender angle={-24} count={3} />
      <EraserRender />
    </div>
  );
}

export function ProductRender({ product, view = "full", photo = 0, sizes = "(max-width: 600px) 50vw, 400px", className = "" }: { product: Product; view?: "full" | "closeup" | "collection"; photo?: number; sizes?: string; className?: string }) {
  const real = view === "full" ? product.photos?.[photo] : undefined;
  if (real) {
    return (
      <div className={`product-render product-photo ${className}`}>
        <Image src={real.src} alt={real.alt} fill sizes={sizes} style={{ objectFit: "cover", objectPosition: real.position ?? "center" }} />
      </div>
    );
  }
  const label = `Concept render of the ${product.name}, not a product photograph`;
  let art: ReactNode;
  if (view === "collection") art = <CollectionRender />;
  else if (product.art === "abacus-pencil") art = view === "closeup" ? <AbacusCloseup count={3} /> : <PencilRender />;
  else art = <ArtRender art={product.art} />;
  return (
    <div className={`product-render art-${product.art} ${className}`} role="img" aria-label={label}>
      {art}
    </div>
  );
}

/** Any catalogue render by name, for thumbnails and category rows. */
export function ArtRender({ art }: { art: ProductArt }) {
  switch (art) {
    case "abacus-pencil": return <PencilRender />;
    case "ink-eraser": return <EraserRender />;
    case "pencil-eraser": return <EraserRender tone="soft" />;
    case "colour-pencils": return <ColourPencilsRender />;
    case "hb-pencils": return <HbPencilsRender />;
    case "sharpener": return <SharpenerRender />;
    case "exercise-book": return <ExerciseBookRender />;
    case "maths-book": return <MathsBookRender />;
    case "ruler": return <RulerRender />;
    case "geometry-set": return <GeometrySetRender />;
    case "crayons": return <CrayonsRender />;
    case "pencil-case": return <PencilCaseRender />;
  }
}

/** AMOFA's real logo icon (gold ribbon), extracted from the brand identity PDF. */
export function BrandMark({ className = "" }: { className?: string }) {
  return <Image src="/images/brand/logo-icon.png" width={836} height={1000} alt="" aria-hidden="true" className={`brand-mark ${className}`} />;
}
