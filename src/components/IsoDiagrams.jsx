// Isometric diagrams for the three "Work with us" steps (reference: RSAShield "How it works").
// Theme-aware via CSS variables (--iso-*). Interactive: the row's hover/focus (`active`) lifts and
// animates parts; the wrapper in StepRows adds a gentle pointer tilt. Reduced motion is honoured
// by the global prefers-reduced-motion rule.
import { useId } from 'react'

const C = 0.866 // cos 30°
const iso = (x, y, z = 0) => [(x - y) * C, (x + y) * 0.5 - z]
const pts = (arr) => arr.map((p) => iso(...p).map((v) => v.toFixed(1)).join(',')).join(' ')
const ISO_MATRIX = `matrix(${C} 0.5 ${-C} 0.5 0 0)`
const MONO = 'IBM Plex Mono, monospace'

/** Rounded slab drawn in isometric space (stacked rounded rects give the soft edge of the reference). */
function Slab({ x, y, w, d, h = 10, z = 0, r = 14, top = 'var(--iso-tile)', side = 'var(--iso-tile-side)', stroke = 'var(--iso-stroke)', fillTop }) {
  const layers = []
  for (let k = 0; k <= h; k += 2) layers.push(k)
  return (
    <g>
      {layers.map((k) => (
        <g key={k} transform={`translate(0 ${-z - k})`}>
          <rect transform={ISO_MATRIX} x={x} y={y} width={w} height={d} rx={r} fill={side} stroke={k === 0 ? stroke : 'none'} strokeWidth="1.2" />
        </g>
      ))}
      <g transform={`translate(0 ${-z - h})`}>
        <rect transform={ISO_MATRIX} x={x} y={y} width={w} height={d} rx={r} fill={fillTop ?? top} stroke={stroke} strokeWidth="1.3" />
      </g>
    </g>
  )
}

/** Solid box at (x, y) with size w×d×h, lifted by z. */
function Box({ x, y, z = 0, w, d, h, top = 'var(--iso-block-top)', side = 'var(--iso-block)', side2 = 'var(--iso-block-dark)', stroke = 'none' }) {
  const T = pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])
  const L = pts([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]])
  const R = pts([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]])
  return (
    <g strokeLinejoin="round">
      <polygon points={L} fill={side} stroke={stroke} />
      <polygon points={R} fill={side2} stroke={stroke} />
      <polygon points={T} fill={top} stroke={stroke} />
    </g>
  )
}

/** Shared frame: soft gradient platform + drop shadow. viewBox fits every part, so nothing is clipped. */
function Frame({ children, label }) {
  const gid = useId().replace(/:/g, '')
  return (
    <svg viewBox="-205 -215 410 350" className="h-auto w-full overflow-visible" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`p${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--iso-plate-hi)' }} />
          <stop offset="1" style={{ stopColor: 'var(--iso-plate)' }} />
        </linearGradient>
      </defs>
      <g style={{ filter: 'drop-shadow(0 16px 22px var(--iso-shadow))' }}>
        <Slab x={-112} y={-112} w={224} d={224} h={10} r={26} side="var(--iso-plate-side)" fillTop={`url(#p${gid})`} />
      </g>
      {children}
    </svg>
  )
}

const ease = 'cubic-bezier(.2,.8,.2,1)'
const lift = (active, px, delay = 0) => ({
  transform: `translateY(${active ? -px : 0}px)`,
  transition: `transform .6s ${ease} ${delay}s`,
})

/* 01 — Get your samples: sample jar + characterisation sheet (Raman · TEM · PSD) */
export function SampleIso({ active }) {
  return (
    <Frame label="Sample jar with a characterisation data sheet">
      {/* datasheet card standing on the back-left edge */}
      <g style={lift(active, 14)}>
        <g transform="translate(-158 -112) skewY(-30)">
          <rect width="128" height="96" rx="10" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" />
          <text x="12" y="20" fontFamily={MONO} fontSize="9" fill="var(--iso-text)">COA · BATCH 042</text>
          {['Raman ID/IG<0.1', 'TEM 2–6 layers', 'PSD D50 5–15µm'].map((t, i) => (
            <g key={t}>
              <rect x="12" y={32 + i * 20} width="10" height="10" rx="2.5" fill="none" stroke="var(--iso-accent)" strokeWidth="1.3" />
              <path
                d={`M14.5 ${37 + i * 20}l2.5 2.5 4-5`}
                fill="none"
                stroke="var(--iso-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={active ? 0 : 1}
                style={{ transition: `stroke-dashoffset .35s ${0.15 + i * 0.15}s` }}
              />
              <text x="28" y={41 + i * 20} fontFamily={MONO} fontSize="8.5" fill="var(--iso-text)">{t}</text>
            </g>
          ))}
        </g>
      </g>
      {/* jar: glass body, graphene fill, dark lid */}
      <g className={active ? '' : 'iso-float'}>
        <g style={lift(active, 20)}>
          <Box x={10} y={0} w={64} d={64} h={78} top="var(--iso-tile)" side="var(--iso-tile-side)" side2="var(--iso-tile-dark)" stroke="var(--iso-stroke)" />
          <g style={{ transform: `translateY(${active ? -8 : 0}px)`, transition: `transform .6s ${ease} .1s` }}>
            <Box x={16} y={6} z={6} w={52} d={52} h={44} />
          </g>
          <g style={{ transform: `translateY(${active ? -26 : 0}px)`, transition: `transform .6s ${ease}` }}>
            <Box x={6} y={-4} z={78} w={72} d={72} h={14} />
          </g>
        </g>
      </g>
    </Frame>
  )
}

/* 02 — Formulate together: parameter tiles + graphene cube dropping into the mix */
export function FormulateIso({ active }) {
  const S = 52
  const tiles = [
    { x: -96, y: -26, t: 'wt%' },
    { x: -26, y: -96, t: 'RPM' },
    { x: 44, y: -26, t: 'D50' },
    { x: -26, y: 44, t: 'resin' },
  ]
  const slot = [[-26, -26], [26, -26], [26, 26], [-26, 26]]
  return (
    <Frame label="Formulation parameters with a graphene block being integrated">
      {tiles.map((tl, i) => {
        const c = iso(tl.x + S / 2, tl.y + S / 2, 10)
        return (
          <g key={tl.t} style={lift(active, 8, i * 0.06)}>
            <Slab x={tl.x} y={tl.y} w={S} d={S} h={10} r={9} />
            <text x={c[0]} y={c[1] + 3} textAnchor="middle" fontFamily={MONO} fontSize="10.5" fill="var(--iso-text)">{tl.t}</text>
          </g>
        )
      })}
      {/* target slot + guides */}
      <polygon points={pts(slot.map(([x, y]) => [x, y, 1]))} fill="none" stroke="var(--iso-accent)" strokeDasharray="4 4" strokeWidth="1.3" />
      {slot.map(([x, y]) => {
        const a = iso(x, y, 1)
        const b = iso(x, y, 128)
        return <line key={`${x}${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--iso-accent)" strokeDasharray="3 5" strokeWidth="1" style={{ opacity: active ? 0 : 0.55, transition: 'opacity .4s' }} />
      })}
      <g className={active ? '' : 'iso-float'}>
        <g style={{ transform: `translateY(${active ? 127 : 0}px)`, transition: `transform .75s ${ease}` }}>
          <Box x={-26} y={-26} z={128} w={52} d={52} h={38} />
        </g>
      </g>
    </Frame>
  )
}

/* 03 — Scale with confidence: batch stack grows; consistency chart + COA badge */
export function ScaleIso({ active }) {
  const layers = [0, 1, 2, 3, 4]
  return (
    <Frame label="Production batches stacking up with a consistency chart and a certified check">
      {/* chart panel standing on the back-right edge */}
      <g style={lift(active, 12)}>
        <g transform="translate(36 -178) skewY(30)">
          <rect width="128" height="88" rx="10" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" />
          <polyline
            points="14,64 36,46 54,56 76,32 96,40 114,20"
            fill="none"
            stroke="var(--iso-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={active ? 0 : 0.65}
            style={{ transition: 'stroke-dashoffset 1s .1s' }}
          />
        </g>
      </g>
      {/* batch stack */}
      {layers.map((i) => (
        <g key={i} style={{ transform: `translateY(${active ? -i * 6 : 0}px)`, opacity: active || i < 3 ? 1 : 0, transition: `transform .6s ${ease} ${i * 0.06}s, opacity .35s ${i * 0.08}s` }}>
          {i === 4 ? (
            <Box x={-34} y={-34} z={i * 18} w={68} d={68} h={14} />
          ) : (
            <Slab x={-34} y={-34} w={68} d={68} h={12} z={i * 18} r={10} />
          )}
        </g>
      ))}
      {/* COA badge, front-left */}
      <g style={lift(active, 16, 0.2)}>
        <g transform="translate(-150 52) skewY(-30)">
          <rect width="74" height="40" rx="10" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="10" fill="var(--iso-accent)" />
          <path d="M15 20l3.5 3.5 6.5-7" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="38" y="24" fontFamily={MONO} fontSize="10" fill="var(--iso-text)">COA</text>
        </g>
      </g>
    </Frame>
  )
}
