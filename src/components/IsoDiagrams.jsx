// Isometric diagrams for the three "Work with us" steps (reference: RSAShield "How it works").
// Theme-aware via CSS variables (--iso-*), light and dark. Interactive: parts lift / animate when
// the row is hovered or focused (`active`), with a slow idle float. Motion is disabled by the
// global prefers-reduced-motion rule.

const C = 0.866 // cos 30°
const iso = (x, y, z = 0) => [(x - y) * C, (x + y) * 0.5 - z]
const pts = (arr) => arr.map((p) => iso(...p).map((v) => v.toFixed(1)).join(',')).join(' ')

/** Rounded-looking platform slab (top + two side faces). */
function Plate({ s = 150, h = 10 }) {
  const top = pts([[-s, -s, 0], [s, -s, 0], [s, s, 0], [-s, s, 0]])
  const left = pts([[-s, s, 0], [s, s, 0], [s, s, -h], [-s, s, -h]])
  const right = pts([[s, -s, 0], [s, s, 0], [s, s, -h], [s, -s, -h]])
  return (
    <g>
      <polygon points={left} fill="var(--iso-plate-side)" stroke="var(--iso-stroke)" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={right} fill="var(--iso-plate-side)" stroke="var(--iso-stroke)" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={top} fill="var(--iso-plate)" stroke="var(--iso-stroke)" strokeWidth="1.4" strokeLinejoin="round" />
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

function Svg({ children, label }) {
  return (
    <svg viewBox="-300 -230 600 430" className="h-auto w-full max-w-[520px] overflow-visible" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

const lift = (active, px) => ({
  transform: `translateY(${active ? -px : 0}px)`,
  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
})

/* 01 — Get your samples: sample jar + characterisation sheet (Raman · TEM · PSD) */
export function SampleIso({ active }) {
  return (
    <Svg label="Sample jar with a characterisation data sheet">
      <Plate />
      {/* datasheet card standing behind */}
      <g style={lift(active, 12)}>
        <g transform="translate(-232 -120)">
          <rect width="168" height="150" rx="12" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" transform="skewY(-30)" />
          <g transform="skewY(-30)" fontFamily="IBM Plex Mono, monospace" fontSize="10.5" fill="var(--iso-text)">
            <text x="16" y="28">COA · BATCH 042</text>
            {['Raman  ID/IG<0.1', 'TEM    2–6 layers', 'PSD    D50 5–15µm'].map((t, i) => (
              <g key={t}>
                <rect x="16" y={46 + i * 34} width="12" height="12" rx="3" fill="none" stroke="var(--iso-accent)" strokeWidth="1.5" />
                <path d={`M19 ${52 + i * 34}l3 3 5-6`} fill="none" stroke="var(--iso-accent)" strokeWidth="1.6" style={{ opacity: active ? 1 : 0.35, transition: `opacity .4s ${i * 0.12}s` }} />
                <text x="36" y={57 + i * 34}>{t}</text>
              </g>
            ))}
          </g>
        </g>
      </g>
      {/* jar */}
      <g style={lift(active, 22)} className="iso-float">
        <Box x={-10} y={10} z={0} w={70} d={70} h={92} top="var(--iso-tile)" side="var(--iso-tile-side)" side2="var(--iso-tile-dark)" stroke="var(--iso-stroke)" />
        <Box x={-4} y={16} z={8} w={58} d={58} h={46} top="var(--iso-block-top)" side="var(--iso-block)" side2="var(--iso-block-dark)" />
        <Box x={-14} y={6} z={92} w={78} d={78} h={16} />
        <text x={iso(30, 80, 70)[0] - 26} y={iso(30, 80, 70)[1]} fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--iso-text)" transform="skewY(30) translate(0 -38)">
          FLG
        </text>
      </g>
    </Svg>
  )
}

/* 02 — Formulate together: parameter tiles + graphene cube dropping into the mix */
export function FormulateIso({ active }) {
  const tiles = [
    { x: -120, y: -40, t: 'wt%' },
    { x: -40, y: -120, t: 'RPM' },
    { x: 40, y: -40, t: 'D50' },
    { x: -40, y: 40, t: 'resin' },
  ]
  return (
    <Svg label="Formulation parameters with a graphene block being integrated">
      <Plate />
      {tiles.map((tl, i) => {
        const c = iso(tl.x + 32, tl.y + 32, 18)
        return (
          <g key={tl.t} style={lift(active, 6 + (i % 2) * 6)}>
            <Box x={tl.x} y={tl.y} w={64} d={64} h={14} top="var(--iso-tile)" side="var(--iso-tile-side)" side2="var(--iso-tile-dark)" stroke="var(--iso-stroke)" />
            <text x={c[0]} y={c[1] + 4} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="13" fill="var(--iso-text)">{tl.t}</text>
          </g>
        )
      })}
      {/* target slot with dashed guides */}
      <polygon points={pts([[-40, -40, 1], [24, -40, 1], [24, 24, 1], [-40, 24, 1]])} fill="none" stroke="var(--iso-accent)" strokeDasharray="5 5" strokeWidth="1.4" />
      {[[-40, -40], [24, -40], [24, 24], [-40, 24]].map(([x, y]) => {
        const a = iso(x, y, 1)
        const b = iso(x, y, 150)
        return <line key={`${x}${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--iso-accent)" strokeDasharray="4 6" strokeWidth="1" opacity="0.6" />
      })}
      <g style={{ transform: `translateY(${active ? 70 : 0}px)`, transition: 'transform .8s cubic-bezier(.2,.8,.2,1)' }} className={active ? '' : 'iso-float'}>
        <Box x={-40} y={-40} z={150} w={64} d={64} h={44} />
      </g>
    </Svg>
  )
}

/* 03 — Scale with confidence: batch stack grows; chart + COA check badge */
export function ScaleIso({ active }) {
  const layers = [0, 1, 2, 3, 4]
  return (
    <Svg label="Production batches stacking up with a consistency chart and a certified check">
      <Plate />
      {/* chart panel */}
      <g style={lift(active, 10)}>
        <g transform="translate(-250 -190)">
          <rect width="150" height="104" rx="10" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" transform="skewY(30)" />
          <polyline transform="skewY(30)" points="18,70 44,50 64,62 88,36 110,46 132,24" fill="none" stroke="var(--iso-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={active ? 0 : 0.6} style={{ transition: 'stroke-dashoffset 1s' }} />
        </g>
      </g>
      {/* batch stack */}
      {layers.map((i) => (
        <g key={i} style={{ transform: `translateY(${active ? -i * 6 : 0}px)`, opacity: active || i < 3 ? 1 : 0.35, transition: `transform .6s ${i * 0.06}s, opacity .4s ${i * 0.08}s` }}>
          <Box x={-40} y={-40} z={i * 22} w={80} d={80} h={18} top={i === 4 ? 'var(--iso-block-top)' : 'var(--iso-tile)'} side={i === 4 ? 'var(--iso-block)' : 'var(--iso-tile-side)'} side2={i === 4 ? 'var(--iso-block-dark)' : 'var(--iso-tile-dark)'} stroke="var(--iso-stroke)" />
        </g>
      ))}
      {/* COA badge */}
      <g style={lift(active, 16)}>
        <g transform="translate(70 30)">
          <rect width="78" height="46" rx="10" fill="var(--iso-tile)" stroke="var(--iso-stroke)" strokeWidth="1.2" transform="skewY(-30)" />
          <g transform="skewY(-30)">
            <circle cx="22" cy="23" r="11" fill="var(--iso-accent)" />
            <path d="M16 23l4 4 8-9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="40" y="27" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--iso-text)">COA</text>
          </g>
        </g>
      </g>
    </Svg>
  )
}
