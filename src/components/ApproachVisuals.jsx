// Data-led visuals for the three advantages. Honest, label-driven graphics instead of
// stock/AI photos; each can be swapped for real Velcoris photography later.
// Panels are always dark (like photo tiles), so colours are fixed rather than themed.

const INK = '#f3f4f6'
const MUTED = '#a9b0bb'
const BLUE = '#7da4ff'
const LINE = '#2a2e35'

export function EconomicalViz({ active }) {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Relative cost per kilogram: imported graphene 11 times, Velcoris 1 times">
      <text x="40" y="70" fill={MUTED} fontFamily="IBM Plex Mono" fontSize="13" letterSpacing="1.5">RELATIVE COST / KG</text>
      {[
        { y: 130, label: 'Imported', w: 320, val: '11×', color: LINE, text: MUTED },
        { y: 230, label: 'Velcoris', w: 320 / 11, val: '1×', color: BLUE, text: INK },
      ].map((b) => (
        <g key={b.label}>
          <text x="40" y={b.y - 14} fill={b.text} fontFamily="Inter Variable" fontSize="16" fontWeight="600">{b.label}</text>
          <rect x="40" y={b.y} width="320" height="44" rx="6" fill="#15171b" />
          <rect
            x="40"
            y={b.y}
            height="44"
            rx="6"
            fill={b.color}
            width={active ? b.w : 0}
            style={{ transition: 'width .9s cubic-bezier(.2,.8,.2,1)' }}
          />
          <text x={active ? Math.min(40 + b.w + 12, 330) : 52} y={b.y + 29} fill={INK} fontFamily="IBM Plex Mono" fontSize="15" style={{ transition: 'x .9s cubic-bezier(.2,.8,.2,1)' }}>
            {b.val}
          </text>
        </g>
      ))}
      <text x="40" y="340" fill={MUTED} fontFamily="Inter Variable" fontSize="14">No expensive imported precursors.</text>
    </svg>
  )
}

export function ScalableViz({ active }) {
  const stages = [
    { label: 'Lab', s: 44 },
    { label: 'Pilot', s: 84 },
    { label: 'Plant', s: 132 },
  ]
  let x = 40
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Lab, pilot and plant batches with the same structure, verified by Raman and XRD">
      <text x="40" y="70" fill={MUTED} fontFamily="IBM Plex Mono" fontSize="13" letterSpacing="1.5">BATCH SCALE</text>
      {stages.map((st, i) => {
        const gx = x
        x += st.s + 28
        return (
          <g key={st.label} style={{ opacity: active ? 1 : 0.25, transition: `opacity .5s ${i * 0.15}s` }}>
            <rect x={gx} y={290 - st.s} width={st.s} height={st.s} rx="6" fill="none" stroke={i === 2 ? BLUE : INK} strokeWidth="1.5" />
            {/* honeycomb hint inside each batch: same structure at every size */}
            <path
              d={`M${gx + st.s / 2} ${290 - st.s / 2 - 10} l8.7 5v10l-8.7 5-8.7-5v-10z`}
              fill="none"
              stroke={i === 2 ? BLUE : MUTED}
              strokeWidth="1.3"
            />
            <text x={gx} y="318" fill={INK} fontFamily="Inter Variable" fontSize="15" fontWeight="600">{st.label}</text>
          </g>
        )
      })}
      <line x1="40" y1="290" x2="360" y2="290" stroke={LINE} />
      <text x="40" y="350" fill={MUTED} fontFamily="Inter Variable" fontSize="14">Same structure. Raman + XRD verified per batch.</text>
    </svg>
  )
}

export function SustainableViz({ active }) {
  const c = 2 * Math.PI * 110
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Zero litres of liquid effluent, no acid inputs, closed-loop energy recovery">
      <text x="40" y="70" fill={MUTED} fontFamily="IBM Plex Mono" fontSize="13" letterSpacing="1.5">CLOSED LOOP</text>
      <circle cx="200" cy="215" r="110" fill="none" stroke={LINE} strokeWidth="2" />
      <circle
        cx="200"
        cy="215"
        r="110"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={active ? c * 0.08 : c}
        transform="rotate(-90 200 215)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }}
      />
      <text x="200" y="225" textAnchor="middle" fill={INK} fontFamily="Inter Tight Variable" fontSize="64" fontWeight="600" letterSpacing="-2">0 L</text>
      <text x="200" y="256" textAnchor="middle" fill={MUTED} fontFamily="IBM Plex Mono" fontSize="12" letterSpacing="1.5">LIQUID EFFLUENT</text>
      <text x="40" y="365" fill={MUTED} fontFamily="Inter Variable" fontSize="14">No acid inputs · energy recovery</text>
    </svg>
  )
}

export const VISUALS = { economical: EconomicalViz, scalable: ScalableViz, sustainable: SustainableViz }
