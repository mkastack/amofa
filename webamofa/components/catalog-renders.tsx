import type { ReactNode } from "react";
import { add, angleOf, darken, isoBox, lighten, planeMatrix, poly, times, useSvgId, type P } from "@/components/svg-kit";

/*
 * Concept renders for the sample catalogue. Same light as the hero renders:
 * key light from the upper left, soft contact shadow below, AMOFA wordmark on every object.
 */

const WORDMARK = "render-wordmark";

function Soft({ id, blur = 11 }: { id: string; blur?: number }) {
  return (
    <filter id={`${id}-soft`} x="-30%" y="-80%" width="160%" height="260%">
      <feGaussianBlur stdDeviation={blur} />
    </filter>
  );
}

function IsoBlock({ id, gid, o, u, v, h, top, front, end, round = 8, shadow = true, children }: { id: string; gid: string; o: P; u: P; v: P; h: number; top: string; front: string; end: string; round?: number; shadow?: boolean; children?: ReactNode }) {
  const box = isoBox(o, u, v, h);
  return (
    <g>
      <defs>
        <linearGradient id={`${gid}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(top, 0.12)} />
          <stop offset="1" stopColor={top} />
        </linearGradient>
        <linearGradient id={`${gid}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={front} />
          <stop offset="1" stopColor={darken(front, 0.12)} />
        </linearGradient>
        <linearGradient id={`${gid}-e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={end} />
          <stop offset="1" stopColor={darken(end, 0.1)} />
        </linearGradient>
      </defs>
      {shadow && <path d={poly(box.base.map((p) => [p[0] + 4, p[1] + 12] as P))} fill="#24272B" opacity=".22" filter={`url(#${id}-soft)`} />}
      <g strokeLinejoin="round" strokeWidth={round}>
        <path d={poly(box.end)} fill={`url(#${gid}-e)`} stroke={end} />
        <path d={poly(box.front)} fill={`url(#${gid}-f)`} stroke={darken(front, 0.04)} />
        <path d={poly(box.top)} fill={`url(#${gid}-t)`} stroke={top} />
      </g>
      <path d={`M${box.front[0].join(" ")} L${box.front[1].join(" ")}`} stroke="#fff" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
      {children}
    </g>
  );
}

/* ───────── Pencils ───────── */

function PlainPencil({ gid, color, length, thick, eraserTop = false, label, lead }: { gid: string; color: string; length: number; thick: number; eraserTop?: boolean; label?: string; lead?: string }) {
  const half = thick / 2;
  const coneStart = length - thick * 2.4;
  const tipStart = length - thick * 0.75;
  const barrelStart = eraserTop ? thick * 1.9 : 0;
  const scallop = coneStart + thick * 0.28;
  const q = thick / 4;
  return (
    <g>
      <defs>
        <linearGradient id={`${gid}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.32)} />
          <stop offset=".25" stopColor={lighten(color, 0.16)} />
          <stop offset=".25" stopColor={color} />
          <stop offset=".75" stopColor={darken(color, 0.08)} />
          <stop offset=".75" stopColor={darken(color, 0.24)} />
          <stop offset="1" stopColor={darken(color, 0.38)} />
        </linearGradient>
        <linearGradient id={`${gid}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7E4C6" />
          <stop offset=".5" stopColor="#EAC795" />
          <stop offset="1" stopColor="#C58F55" />
        </linearGradient>
        <linearGradient id={`${gid}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BCC2CA" />
          <stop offset=".25" stopColor="#FFFFFF" />
          <stop offset=".6" stopColor="#CDD2D9" />
          <stop offset="1" stopColor="#7B818C" />
        </linearGradient>
      </defs>
      <path d={`M${coneStart} ${-half} L${tipStart} ${-thick * 0.16} L${tipStart} ${thick * 0.16} L${coneStart} ${half} Z`} fill={`url(#${gid}-w)`} />
      <path d={`M${tipStart} ${-thick * 0.16} L${length} 0 L${tipStart} ${thick * 0.16} Z`} fill={lead ?? darken(color, 0.25)} />
      <path d={`M${barrelStart} ${-half} H${coneStart} Q${scallop} ${-half + q} ${coneStart} ${-q} Q${scallop + thick * 0.22} 0 ${coneStart} ${q} Q${scallop} ${half - q} ${coneStart} ${half} H${barrelStart} Z`} fill={`url(#${gid}-b)`} />
      <rect x={barrelStart} y={-half + thick * 0.08} width={coneStart - barrelStart} height={thick * 0.05} fill="#fff" opacity=".3" />
      {eraserTop ? (
        <>
          <path d={`M${thick * 0.9} ${-half * 0.92} H${thick * 0.45} Q0 ${-half * 0.92} 0 ${-half * 0.3} V${half * 0.3} Q0 ${half * 0.92} ${thick * 0.45} ${half * 0.92} H${thick * 0.9} Z`} fill="#F2B7B0" />
          <rect x={thick * 0.8} y={-half * 1.06} width={thick * 1.15} height={thick * 1.06} rx="2" fill={`url(#${gid}-m)`} />
          <path d={`M${thick * 1.05} ${-half} V${half} M${thick * 1.65} ${-half} V${half}`} stroke="#7B818C" strokeOpacity=".5" strokeWidth="1.4" />
        </>
      ) : (
        <rect x="-2" y={-half} width="5" height={thick} rx="2" fill={darken(color, 0.3)} />
      )}
      {label && <text className={WORDMARK} x={barrelStart + thick * 1.2} y={thick * 0.17} fontSize={thick * 0.44} fill="#fff" fillOpacity=".92">{label}</text>}
    </g>
  );
}

const COLOURS = ["#E0483E", "#F08A2C", "#F4C02E", "#3FA45B", "#315CBB", "#7A4BC2"];

export function ColourPencilsRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const stagger = [0, 34, 12, 48, 6, 26];
  return (
    <svg className={`render render-catalog ${className}`} viewBox="40 10 540 420" aria-hidden="true" focusable="false">
      <defs><Soft id={id} blur={9} /></defs>
      {COLOURS.map((colour, i) => {
        const x = 92 + i * 15 + stagger[i] * 0.866;
        const y = 236 + i * 26 - stagger[i] * 0.5;
        return (
          <g key={colour}>
            <g transform={`translate(${x} ${y + 14}) rotate(-30)`} opacity=".16" filter={`url(#${id}-soft)`}><rect x="0" y="-12" width="410" height="24" rx="12" fill="#24272B" /></g>
            <g transform={`translate(${x} ${y}) rotate(-30)`}>
              <PlainPencil gid={`${id}p${i}`} color={colour} length={410} thick={26} label={i === 4 ? "amofa" : undefined} lead={darken(colour, 0.15)} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export function HbPencilsRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  return (
    <svg className={`render render-catalog ${className}`} viewBox="40 20 540 400" aria-hidden="true" focusable="false">
      <defs><Soft id={id} blur={10} /></defs>
      {[0, 1, 2].map((i) => {
        const x = 96 + i * 26 + (i === 1 ? 30 : 0);
        const y = 282 + i * 40 - (i === 1 ? 17 : 0);
        return (
          <g key={i}>
            <g transform={`translate(${x} ${y + 16}) rotate(-28)`} opacity=".18" filter={`url(#${id}-soft)`}><rect x="0" y="-15" width="440" height="30" rx="15" fill="#24272B" /></g>
            <g transform={`translate(${x} ${y}) rotate(-28)`}>
              <PlainPencil gid={`${id}h${i}`} color="#30343A" length={440} thick={30} eraserTop label="amofa HB" lead="#2B2E33" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ───────── Blocks, books, tins ───────── */

export function SharpenerRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const o: P = [168, 150];
  const u: P = [232, -46];
  const v: P = [74, 58];
  const h = 104;
  const front0 = add(o, v);
  const un: P = times(u, 1 / Math.hypot(u[0], u[1]));
  const lid = planeMatrix(o, u, v);
  const holes: [number, number][] = [[0.3, 22], [0.68, 31]];
  return (
    <svg className={`render render-catalog ${className}`} viewBox="80 50 440 320" aria-hidden="true" focusable="false">
      <defs>
        <Soft id={id} />
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6F9" />
          <stop offset=".5" stopColor="#C3C9D1" />
          <stop offset="1" stopColor="#8D949E" />
        </linearGradient>
        <radialGradient id={`${id}-hole`} cx=".42" cy=".38" r=".7">
          <stop offset="0" stopColor="#3A4A72" />
          <stop offset=".55" stopColor="#14213F" />
          <stop offset="1" stopColor="#0A1226" />
        </radialGradient>
      </defs>
      <IsoBlock id={id} gid={`${id}s`} o={o} u={u} v={v} h={h} top="#4A74D0" front="#315CBB" end="#2A52A8" round={12}>
        <g transform={lid.transform}>
          <rect x={28} y={lid.height * 0.52} width={lid.width - 56} height={lid.height * 0.3} rx="4" fill={`url(#${id}-metal)`} />
          <circle cx={lid.width * 0.32} cy={lid.height * 0.67} r="6" fill="#9AA1AB" stroke="#E9ECF1" strokeWidth="1.5" />
          <circle cx={lid.width * 0.7} cy={lid.height * 0.67} r="6" fill="#9AA1AB" stroke="#E9ECF1" strokeWidth="1.5" />
          <text className={WORDMARK} x={28} y={lid.height * 0.38} fontSize="22" fill="#fff" fillOpacity=".95">amofa</text>
        </g>
        {holes.map(([s, r]) => {
          const c = add(add(front0, times(u, s)), [0, h * 0.54]);
          return (
            <g key={s} transform={`matrix(${un[0]} ${un[1]} 0 1 ${c[0]} ${c[1]})`}>
              <circle r={r + 6} fill={`url(#${id}-metal)`} />
              <circle r={r} fill={`url(#${id}-hole)`} />
              <path d={`M${-r * 0.55} ${-r * 0.55} A${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.5} ${-r * 0.62}`} stroke="#fff" strokeOpacity=".22" strokeWidth="2" fill="none" />
            </g>
          );
        })}
      </IsoBlock>
    </svg>
  );
}

function BookRender({ cover, title, squared = false, className = "" }: { cover: string; title: string; squared?: boolean; className?: string }) {
  const id = useSvgId();
  const o: P = [112, 136];
  const u: P = [232, -48];
  const v: P = [174, 138];
  const h = 16;
  const top = planeMatrix(o, u, v);
  const frontOrigin = add(o, v);
  const un: P = times(u, 1 / Math.hypot(u[0], u[1]));
  const W = top.width;
  const H = top.height;
  return (
    <svg className={`render render-catalog ${className}`} viewBox="80 60 460 320" aria-hidden="true" focusable="false">
      <defs><Soft id={id} /></defs>
      <IsoBlock id={id} gid={`${id}k`} o={o} u={u} v={v} h={h} top={cover} front="#F4F1EA" end={darken(cover, 0.22)} round={6}>
        <g transform={`matrix(${un[0]} ${un[1]} 0 1 ${frontOrigin[0]} ${frontOrigin[1]})`}>
          {[4, 8, 12].map((y) => <line key={y} x1="6" x2={W - 6} y1={y} y2={y} stroke="#D6D0C3" strokeWidth="1" />)}
        </g>
        <g transform={top.transform}>
          <rect x="0" y="0" width="16" height={H} fill={darken(cover, 0.16)} />
          <rect x="52" y="30" width={W - 82} height="78" rx="7" fill="#FBFAF7" />
          {[56, 76, 96].map((y) => <line key={y} x1="66" x2={W - 44} y1={y} y2={y} stroke="#C9D6F0" strokeWidth="1.6" />)}
          <text className={WORDMARK} x="52" y={H - 54} fontSize="30" fill="#fff">amofa</text>
          <text x="54" y={H - 34} fontSize="11" fontWeight="700" letterSpacing="2.4" fill="#fff" fillOpacity=".85" fontFamily="var(--font-sans)">{title}</text>
          {squared && (
            <g transform={`translate(${W - 68} ${H - 74})`} stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" fill="none">
              <rect width="42" height="42" rx="3" />
              <path d="M14 0V42M28 0V42M0 14H42M0 28H42" />
            </g>
          )}
        </g>
      </IsoBlock>
    </svg>
  );
}

export function ExerciseBookRender({ className = "" }: { className?: string }) {
  return <BookRender cover="#315CBB" title="EXERCISE BOOK" className={className} />;
}

export function MathsBookRender({ className = "" }: { className?: string }) {
  return <BookRender cover="#2E8B6E" title="MATHS BOOK" squared className={className} />;
}

export function RulerRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const o: P = [96, 214];
  const u: P = [432, -92];
  const v: P = [30, 24];
  const h = 7;
  const top = planeMatrix(o, u, v);
  const W = top.width;
  const H = top.height;
  const ticks = Array.from({ length: 31 }, (_, i) => i);
  const step = (W - 30) / 30;
  return (
    <svg className={`render render-catalog ${className}`} viewBox="70 70 480 230" aria-hidden="true" focusable="false">
      <defs><Soft id={id} blur={8} /></defs>
      <IsoBlock id={id} gid={`${id}r`} o={o} u={u} v={v} h={h} top="#DCE5F7" front="#A9BCE3" end="#BFCDEB" round={4}>
        <g transform={top.transform}>
          {ticks.map((i) => {
            const x = 15 + i * step;
            const len = i % 5 === 0 ? 13 : i % 1 === 0 ? 8 : 5;
            return <line key={i} x1={x} x2={x} y1={H - 2} y2={H - 2 - len} stroke="#1C3A7C" strokeWidth="1.1" />;
          })}
          {ticks.filter((i) => i % 5 === 0).map((i) => (
            <text key={`n${i}`} x={15 + i * step} y={H - 18} fontSize="7.5" textAnchor="middle" fill="#1C3A7C" fontFamily="var(--font-sans)" fontWeight="600">{i}</text>
          ))}
          <text className={WORDMARK} x={W * 0.44} y="11" fontSize="10" fill="#1C3A7C">amofa</text>
        </g>
      </IsoBlock>
    </svg>
  );
}

export function GeometrySetRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const o: P = [104, 160];
  const u: P = [312, -64];
  const v: P = [124, 98];
  const h = 28;
  const top = planeMatrix(o, u, v);
  const W = top.width;
  const H = top.height;
  const cx = W * 0.33;
  const cy = H * 0.84;
  const r = 60;
  return (
    <svg className={`render render-catalog ${className}`} viewBox="80 60 470 300" aria-hidden="true" focusable="false">
      <defs><Soft id={id} /></defs>
      <IsoBlock id={id} gid={`${id}g`} o={o} u={u} v={v} h={h} top="#24468F" front="#1C3A7C" end="#183470" round={10}>
        <g transform={top.transform} fill="none" stroke="#fff" strokeLinecap="round">
          <rect x="7" y="7" width={W - 14} height={H - 14} rx="8" strokeOpacity=".22" strokeWidth="1.5" />
          <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} strokeOpacity=".9" strokeWidth="2" />
          <path d={`M${cx - r * 0.62} ${cy} A${r * 0.62} ${r * 0.62} 0 0 1 ${cx + r * 0.62} ${cy}`} strokeOpacity=".6" strokeWidth="1.4" />
          {Array.from({ length: 13 }, (_, i) => {
            const a = Math.PI - (i * Math.PI) / 12;
            return <line key={i} x1={cx + Math.cos(a) * r} y1={cy - Math.sin(a) * r} x2={cx + Math.cos(a) * (r - 8)} y2={cy - Math.sin(a) * (r - 8)} strokeOpacity=".8" strokeWidth="1.2" />;
          })}
          <path d={`M${W * 0.64} ${H * 0.3} L${W * 0.64} ${H * 0.84} L${W * 0.9} ${H * 0.84} Z`} strokeOpacity=".9" strokeWidth="2" strokeLinejoin="round" />
          <path d={`M${W * 0.67} ${H * 0.48} L${W * 0.67} ${H * 0.78} L${W * 0.8} ${H * 0.78} Z`} strokeOpacity=".55" strokeWidth="1.4" strokeLinejoin="round" />
        </g>
        <g transform={top.transform}>
          <text className={WORDMARK} x="24" y="36" fontSize="22" fill="#fff">amofa</text>
          <text x="25" y="52" fontSize="8.5" fontWeight="700" letterSpacing="2.2" fill="#fff" fillOpacity=".8" fontFamily="var(--font-sans)">GEOMETRY SET</text>
        </g>
      </IsoBlock>
    </svg>
  );
}

const CRAYONS = ["#E0483E", "#F08A2C", "#F4C02E", "#3FA45B", "#2BA3A3", "#315CBB", "#7A4BC2", "#E05C9A"];

export function CrayonsRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const o: P = [160, 196];
  const u: P = [252, -52];
  const v: P = [66, 52];
  const h = 118;
  const box = isoBox(o, u, v, h);
  const frontMid = add(add(o, v), add(times(u, 0.5), [0, h * 0.5]));
  const tilt = angleOf(u);
  return (
    <svg className={`render render-catalog ${className}`} viewBox="100 40 420 340" aria-hidden="true" focusable="false">
      <defs>
        <Soft id={id} />
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B67C6" />
          <stop offset="1" stopColor="#264C9F" />
        </linearGradient>
      </defs>
      <path d={poly(box.base.map((p) => [p[0] + 4, p[1] + 12] as P))} fill="#24272B" opacity=".22" filter={`url(#${id}-soft)`} />
      <path d={poly(box.end)} fill="#2A52A8" stroke="#2A52A8" strokeWidth="8" strokeLinejoin="round" />
      <path d={poly(box.top)} fill="#142B5E" stroke="#1C3A7C" strokeWidth="8" strokeLinejoin="round" />
      {CRAYONS.map((colour, i) => {
        const p = add(add(o, times(u, 0.1 + (0.8 * i) / (CRAYONS.length - 1))), times(v, 0.5));
        const rise = 50 + (i % 3) * 15 + (i % 2) * 6;
        const x = p[0];
        const y = p[1] - rise;
        return (
          <g key={colour}>
            <rect x={x - 11} y={y} width="22" height={rise + 34} rx="3" fill={colour} />
            <rect x={x - 11} y={y + 22} width="22" height="5" fill={darken(colour, 0.25)} opacity=".7" />
            <rect x={x - 11} y={y + 31} width="22" height="2" fill={darken(colour, 0.25)} opacity=".6" />
            <path d={`M${x - 11} ${y + 1} L${x - 6} ${y - 16} Q${x} ${y - 24} ${x + 6} ${y - 16} L${x + 11} ${y + 1} Z`} fill={darken(colour, 0.08)} />
            <rect x={x - 8} y={y + 2} width="3.5" height={rise + 20} rx="1.7" fill="#fff" opacity=".28" />
          </g>
        );
      })}
      <path d={poly(box.front)} fill={`url(#${id}-front)`} stroke="#2E57B4" strokeWidth="8" strokeLinejoin="round" />
      <path d={`M${box.front[0].join(" ")} L${box.front[1].join(" ")}`} stroke="#fff" strokeOpacity=".5" strokeWidth="2.5" strokeLinecap="round" />
      <g transform={`rotate(${tilt} ${frontMid[0]} ${frontMid[1]})`}>
        <text className={WORDMARK} x={frontMid[0]} y={frontMid[1] + 4} fontSize="30" fill="#fff" textAnchor="middle">amofa</text>
        <text x={frontMid[0]} y={frontMid[1] + 24} fontSize="10" fontWeight="700" letterSpacing="2.4" fill="#fff" fillOpacity=".85" textAnchor="middle" fontFamily="var(--font-sans)">WAX CRAYONS · 16</text>
      </g>
    </svg>
  );
}

export function PencilCaseRender({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const body = "M110 176 C110 140 132 128 172 126 L430 116 C470 115 490 131 490 166 L492 280 C492 306 476 319 446 320 L156 327 C124 328 108 313 108 287 Z";
  const zip = "M124 152 Q300 133 478 142";
  return (
    <svg className={`render render-catalog ${className}`} viewBox="70 70 460 300" aria-hidden="true" focusable="false">
      <defs>
        <Soft id={id} blur={13} />
        <linearGradient id={`${id}-fab`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3460C2" />
          <stop offset=".55" stopColor="#264C9F" />
          <stop offset="1" stopColor="#1A3676" />
        </linearGradient>
        <pattern id={`${id}-weave`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#fff" strokeOpacity=".07" strokeWidth="2" />
        </pattern>
        <linearGradient id={`${id}-pull`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F6F9" />
          <stop offset="1" stopColor="#8D949E" />
        </linearGradient>
      </defs>
      <ellipse cx="300" cy="334" rx="200" ry="14" fill="#24272B" opacity=".26" filter={`url(#${id}-soft)`} />
      <path d={body} fill={`url(#${id}-fab)`} />
      <path d={body} fill={`url(#${id}-weave)`} />
      <path d="M128 168 Q300 150 474 158" stroke="#fff" strokeOpacity=".14" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={zip} stroke="#142B5E" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d={zip} stroke="#C9D6F0" strokeWidth="6" strokeDasharray="2.2 2.8" fill="none" />
      <g transform="translate(408 138) rotate(-6)">
        <rect x="-10" y="-6" width="22" height="12" rx="3" fill={`url(#${id}-pull)`} />
        <rect x="-4" y="4" width="10" height="34" rx="4" fill={`url(#${id}-pull)`} />
        <circle cx="1" cy="31" r="3" fill="#264C9F" />
      </g>
      <rect x="150" y="248" width="96" height="36" rx="7" fill="#F7F6F2" />
      <text className={WORDMARK} x="198" y="272" fontSize="19" fill="#1C3A7C" textAnchor="middle">amofa</text>
    </svg>
  );
}
