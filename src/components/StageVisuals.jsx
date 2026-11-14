// Visual panels for the six process stages (Technology page).
// Pattern-style SVG diagrams instead of photos: they explain each stage at a glance and
// weigh ~nothing. Panels are always dark, so colours are fixed. Blue is used only as a
// single highlight per diagram. Animations run while the card is in view (`active`) and
// are disabled by the global prefers-reduced-motion rule.

const INK = '#f3f4f6'
const MUTED = '#a9b0bb'
const DIM = '#5b626d'
const LINE = '#2a2e35'
const BLUE = '#93abe0'
const mono = { fontFamily: 'IBM Plex Mono, monospace' }
const sans = { fontFamily: 'Inter Variable, sans-serif' }

function Frame({ label, children, foot }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden="true">
      <text x="28" y="40" fill={MUTED} fontSize="12" letterSpacing="1.6" style={mono}>{label}</text>
      {children}
      {foot && <text x="28" y="336" fill={MUTED} fontSize="11" letterSpacing="0.6" style={mono}>{foot}</text>}
    </svg>
  )
}

// deterministic pseudo-random so SSR/CSR match and nothing jitters between renders
const rand = (i) => {
  const x = Math.sin(i * 999.13) * 10000
  return x - Math.floor(x)
}

/* 01 Feedstock: mixed precursor → baseline gate removes S, Pb, H₂O → uniform feedstock */
export function FeedstockViz({ active }) {
  const raw = Array.from({ length: 34 }, (_, i) => ({ x: 40 + rand(i) * 160, y: 80 + rand(i + 50) * 200, r: 2.5 + rand(i + 9) * 4 }))
  const bad = [
    { x: 120, y: 120, t: 'S' },
    { x: 170, y: 210, t: 'Pb' },
    { x: 90, y: 250, t: 'H₂O' },
  ]
  return (
    <Frame label="PRECURSOR BASELINE" foot="Sulfur · heavy metals · moisture removed before loading">
      <g className={active ? 'viz-drift' : ''}>
        {raw.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={i % 3 ? DIM : MUTED} />
        ))}
      </g>
      {bad.map((b) => (
        <g key={b.t} style={{ opacity: active ? 0.9 : 0.4, transition: 'opacity .6s' }}>
          <circle cx={b.x} cy={b.y} r="11" fill="none" stroke={MUTED} strokeDasharray="3 3" />
          <path d={`M${b.x - 6} ${b.y - 6}l12 12M${b.x + 6} ${b.y - 6}l-12 12`} stroke={MUTED} strokeWidth="1.3" />
          <text x={b.x + 15} y={b.y + 4} fill={MUTED} fontSize="11" style={mono}>{b.t}</text>
        </g>
      ))}
      {/* baseline gate */}
      <line x1="250" y1="70" x2="250" y2="295" stroke={BLUE} strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="258" y="80" fill={BLUE} fontSize="11" style={mono}>GATE</text>
      {/* uniform output */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={300 + c * 30}
            cy={110 + r * 30}
            r="4.5"
            fill={INK}
            style={{ opacity: active ? 1 : 0.2, transition: `opacity .5s ${(r * 5 + c) * 0.02}s` }}
          />
        )),
      )}
    </Frame>
  )
}

/* 02 Cartridge: reusable modular cartridge, cells fill as it loads, sealed boundary */
export function CartridgeViz({ active }) {
  return (
    <Frame label="MODULAR PROCESS CARTRIDGE" foot="Reusable · fast reload · sealed thermal boundary">
      <rect x="110" y="80" width="260" height="210" rx="18" fill="none" stroke={BLUE} strokeWidth="1.6" />
      <rect x="122" y="92" width="236" height="186" rx="12" fill="#15171b" stroke={LINE} />
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => {
          const i = r * 4 + c
          return (
            <g key={i}>
              <rect x={138 + c * 53} y={108 + r * 54} width="44" height="44" rx="6" fill="none" stroke={DIM} />
              <rect
                x={138 + c * 53}
                y={108 + r * 54}
                width="44"
                height="44"
                rx="6"
                fill={INK}
                style={{ opacity: active ? 0.92 : 0, transition: `opacity .35s ${0.15 + i * 0.08}s` }}
              />
            </g>
          )
        }),
      )}
      {/* load arrow */}
      <path d="M40 185h52" stroke={MUTED} strokeWidth="1.5" />
      <path d="M86 179l8 6-8 6" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <text x="40" y="172" fill={MUTED} fontSize="11" style={mono}>LOAD</text>
      <text x="386" y="190" fill={BLUE} fontSize="11" style={mono}>SEAL</text>
    </Frame>
  )
}

/* 03 Reactor: thermodynamic core with controlled temperature/pressure profile */
export function ReactorViz({ active }) {
  return (
    <Frame label="REACTOR THERMAL PROFILE" foot="Controlled temperature & pressure · zero liquid effluent">
      <g transform="translate(170 185)">
        {[96, 74, 52].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke={i === 0 ? LINE : DIM} strokeWidth="1.2" />
        ))}
        <circle r="96" fill="none" stroke={BLUE} strokeWidth="1.6" strokeDasharray="6 10" className={active ? 'viz-spin' : ''} />
        <circle r="30" fill={INK} className={active ? 'viz-pulse' : ''} opacity="0.9" />
        <text y="5" textAnchor="middle" fill="#0b0d10" fontSize="11" fontWeight="600" style={mono}>CORE</text>
      </g>
      {/* T and P gauges */}
      {[
        { y: 110, l: 'T', v: 0.82 },
        { y: 200, l: 'P', v: 0.58 },
      ].map((g) => (
        <g key={g.l}>
          <text x="318" y={g.y - 10} fill={MUTED} fontSize="11" style={mono}>{g.l === 'T' ? 'TEMPERATURE' : 'PRESSURE'}</text>
          <rect x="318" y={g.y} width="130" height="8" rx="4" fill="#15171b" />
          <rect x="318" y={g.y} height="8" rx="4" fill={g.l === 'T' ? BLUE : INK} width={active ? 130 * g.v : 0} style={{ transition: 'width 1s cubic-bezier(.2,.8,.2,1)' }} />
        </g>
      ))}
      <text x="318" y="262" fill={INK} fontSize="17" fontWeight="600" style={sans}>Patent-pending</text>
      <text x="318" y="282" fill={MUTED} fontSize="12" style={sans}>in-house reactor</text>
    </Frame>
  )
}

/* 04 Collection: closed-loop extraction, isolated from ambient atmosphere */
export function CollectionViz({ active }) {
  return (
    <Frame label="CLOSED-LOOP HARVEST" foot="Atmosphere-isolated extraction preserves the lattice">
      <rect x="44" y="110" width="130" height="140" rx="12" fill="#15171b" stroke={DIM} />
      <text x="109" y="185" textAnchor="middle" fill={INK} fontSize="13" fontWeight="600" style={sans}>Reactor</text>
      <rect x="306" y="130" width="130" height="120" rx="12" fill="#15171b" stroke={DIM} />
      <text x="371" y="195" textAnchor="middle" fill={INK} fontSize="13" fontWeight="600" style={sans}>Collection</text>
      {/* sealed loop */}
      <path
        d="M174 150 H306 M306 220 H174"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeDasharray="8 8"
        className={active ? 'viz-flow' : ''}
      />
      <path d="M296 144l10 6-10 6M184 214l-10 6 10 6" fill="none" stroke={BLUE} strokeWidth="2" />
      <rect x="30" y="80" width="420" height="200" rx="20" fill="none" stroke={LINE} strokeDasharray="2 6" />
      <text x="240" y="100" textAnchor="middle" fill={MUTED} fontSize="11" style={mono}>ISOLATED FROM AMBIENT</text>
    </Frame>
  )
}

/* 05 Refinement: lateral flake-size classification, D50 target band 5–15 µm */
export function RefinementViz({ active }) {
  const bins = [4, 9, 18, 34, 58, 82, 96, 88, 66, 42, 24, 12, 6, 3]
  const x0 = 44
  const w = 26
  return (
    <Frame label="SIZE CLASSIFICATION · D50" foot="Target band 5 – 15 µm · illustrative distribution">
      <line x1={x0} y1="280" x2={x0 + bins.length * w} y2="280" stroke={DIM} />
      {bins.map((h, i) => {
        const inBand = i >= 4 && i <= 9
        return (
          <rect
            key={i}
            x={x0 + i * w + 3}
            width={w - 6}
            rx="3"
            fill={inBand ? BLUE : DIM}
            y={active ? 280 - h * 1.9 : 280}
            height={active ? h * 1.9 : 0}
            style={{ transition: `y .7s ${i * 0.04}s cubic-bezier(.2,.8,.2,1), height .7s ${i * 0.04}s cubic-bezier(.2,.8,.2,1)` }}
          />
        )
      })}
      {[
        ['1', 0],
        ['5', 4],
        ['15', 10],
        ['30', 13],
      ].map(([t, i]) => (
        <text key={t} x={x0 + i * w + w / 2} y="300" textAnchor="middle" fill={MUTED} fontSize="11" style={mono}>{t}</text>
      ))}
      <text x={x0 + bins.length * w - 4} y="318" textAnchor="end" fill={MUTED} fontSize="10" style={mono}>µm</text>
      <text x="300" y="86" fill={INK} fontSize="26" fontWeight="600" style={sans}>5 – 15 µm</text>
      <text x="300" y="106" fill={MUTED} fontSize="12" style={sans}>D50 lateral size</text>
    </Frame>
  )
}

/* 06 Verification: Raman fingerprint (D ≈ 1350, G ≈ 1580, 2D ≈ 2700 cm⁻¹), ID/IG < 0.1 */
export function VerificationViz({ active }) {
  // x: 1200–2900 cm⁻¹ mapped to 40–440; y baseline 280
  const X = (k) => 40 + ((k - 1200) / 1700) * 400
  const peak = (k0, h, wdt) => (k) => h * Math.exp(-((k - k0) ** 2) / (2 * wdt * wdt))
  const peaks = [peak(1350, 14, 18), peak(1580, 170, 14), peak(2700, 120, 24)]
  const pts = []
  for (let k = 1200; k <= 2900; k += 8) pts.push(`${X(k).toFixed(1)},${(280 - peaks.reduce((s, p) => s + p(k), 0)).toFixed(1)}`)
  return (
    <Frame label="RAMAN SPECTRUM · BATCH QA" foot="Illustrative spectrum · values certified on each batch COA">
      <line x1="40" y1="280" x2="440" y2="280" stroke={DIM} />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={INK}
        strokeWidth="1.8"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={active ? 0 : 1}
        style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)' }}
      />
      {[
        ['D', 1350, 262],
        ['G', 1580, 100],
        ['2D', 2700, 150],
      ].map(([t, k, y]) => (
        <text key={t} x={X(k)} y={y} textAnchor="middle" fill={MUTED} fontSize="11" style={mono}>{t}</text>
      ))}
      <g style={{ opacity: active ? 1 : 0, transition: 'opacity .5s 1.2s' }}>
        <rect x="300" y="62" width="140" height="30" rx="15" fill="none" stroke={BLUE} />
        <text x="370" y="82" textAnchor="middle" fill={BLUE} fontSize="12" style={mono}>ID/IG &lt; 0.1</text>
      </g>
      <text x="40" y="300" fill={MUTED} fontSize="10" style={mono}>1200</text>
      <text x="440" y="300" textAnchor="end" fill={MUTED} fontSize="10" style={mono}>2900 cm⁻¹</text>
    </Frame>
  )
}

export const STAGE_VISUALS = {
  feedstock: FeedstockViz,
  cartridge: CartridgeViz,
  reactor: ReactorViz,
  collection: CollectionViz,
  refinement: RefinementViz,
  verification: VerificationViz,
}
