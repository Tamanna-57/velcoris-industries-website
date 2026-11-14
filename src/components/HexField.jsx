import { useEffect, useRef } from 'react'

/**
 * Animated 2D graphene lattice for the hero (canvas).
 *
 * 1. Grow: hexagonal cells appear one after another, spreading out from a seed just under the
 *    navigation bar until the whole section is covered (~2.6 s).
 * 2. Live: some cells slowly dim and recover, and pulses of "current" run along the lattice edges
 *    like circuitry, lighting the nodes they pass.
 *
 * The lattice is faded behind the centred hero copy so the text stays readable. Respects
 * prefers-reduced-motion (draws the finished lattice once, no motion), pauses when off screen or
 * when the tab is hidden, follows the light/dark theme, and caps the pixel ratio at 2.
 */

const SQ3 = Math.sqrt(3)
const GROW_S = 2.6 // time for the growth to reach the farthest cell
const CELL_IN_S = 0.42 // fade/scale-in time of one cell

const PALETTE = {
  light: { line: '17,18,20', lineA: 0.2, dotA: 0.32, pulse: '74,102,184', glow: 0.26 },
  dark: { line: '255,255,255', lineA: 0.15, dotA: 0.28, pulse: '147,171,224', glow: 0.4 },
}
const theme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)

function buildGrid(W, H, seedY) {
  const R = Math.max(24, Math.min(42, W / 34)) // hex radius (centre to vertex)
  const w = SQ3 * R
  const rowH = 1.5 * R
  const cells = []
  const vKey = (x, y) => `${Math.round(x)}:${Math.round(y)}`
  const verts = new Map() // key → {x, y, n: Set of neighbour keys}
  const seedX = W / 2
  let maxD = 1
  for (let row = -1; row * rowH < H + 2 * R; row++) {
    for (let col = -1; col * w < W + w; col++) {
      const cx = col * w + (row & 1 ? w / 2 : 0)
      const cy = row * rowH
      const corners = []
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 180) * (60 * k - 90) // pointy-top
        corners.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
      }
      const d = Math.hypot(cx - seedX, (cy - seedY) * 1.15)
      maxD = Math.max(maxD, d)
      cells.push({ cx, cy, corners, d, jitter: Math.random() * 0.22, dim: Math.random() < 0.4, phase: Math.random() * Math.PI * 2, period: 4 + Math.random() * 5 })
      for (let k = 0; k < 6; k++) {
        const [ax, ay] = corners.at(k)
        const [bx, by] = corners.at((k + 1) % 6)
        const ka = vKey(ax, ay)
        const kb = vKey(bx, by)
        if (!verts.has(ka)) verts.set(ka, { x: ax, y: ay, n: new Set() })
        if (!verts.has(kb)) verts.set(kb, { x: bx, y: by, n: new Set() })
        verts.get(ka).n.add(kb)
        verts.get(kb).n.add(ka)
      }
    }
  }
  for (const c of cells) c.delay = (c.d / maxD) * GROW_S + c.jitter
  const vList = [...verts.entries()].map(([k, v]) => ({ k, ...v, n: [...v.n] })).filter((v) => v.x > -R && v.x < W + R && v.y > seedY - R && v.y < H + R)
  return { R, cells, verts, vList, growEnd: GROW_S + 0.22 + CELL_IN_S }
}

export default function HexField({ className = '', topOffset = 72, protectRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let grid = null
    let pal = PALETTE[theme()]
    let raf = 0
    let running = false
    let visible = true
    const t0 = performance.now()
    let pulses = []
    let lastPulseAt = 0
    const mask = document.createElement('canvas') // soft-edged hole behind the copy, rebuilt on resize
    const mctx = mask.getContext('2d')

    // Build the text-protection mask: the copy block's rectangle, feathered with a shadow blur
    // (works in every browser, computed once per resize instead of every frame).
    const buildMask = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      mask.width = canvas.width
      mask.height = canvas.height
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mctx.clearRect(0, 0, W, H)
      const el = protectRef?.current
      if (!el) return
      const pr = canvas.parentElement.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const pad = 28
      const x = r.left - pr.left - pad
      const y = r.top - pr.top - pad
      const w = r.width + pad * 2
      const h = r.height + pad * 2
      const off = 10000
      mctx.shadowColor = 'rgba(0,0,0,0.96)'
      mctx.shadowBlur = 44
      mctx.shadowOffsetX = off
      mctx.fillStyle = '#000'
      mctx.beginPath()
      mctx.roundRect(x - off, y, w, h, 48)
      mctx.fill()
      mctx.beginPath() // solid core so the text area itself is fully clean
      mctx.shadowColor = 'transparent'
      mctx.roundRect(x + 12, y + 12, w - 24, h - 24, 36)
      mctx.fill()
    }

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      grid = buildGrid(W, H, topOffset + 6)
      pulses = []
      buildMask()
    }

    // A pulse = a random walk along lattice edges, drawn as a glowing head with a fading tail.
    const spawnPulse = () => {
      const vs = grid.vList
      if (!vs.length) return
      let v = vs[Math.floor(Math.random() * vs.length)]
      const path = [v]
      let prev = null
      const len = 9 + Math.floor(Math.random() * 12)
      for (let i = 0; i < len; i++) {
        const opts = v.n.filter((k) => k !== prev).map((k) => grid.verts.get(k)).filter(Boolean)
        if (!opts.length) break
        const next = opts[Math.floor(Math.random() * opts.length)]
        prev = v.k ?? `${Math.round(v.x)}:${Math.round(v.y)}`
        v = { ...next, k: `${Math.round(next.x)}:${Math.round(next.y)}`, n: [...next.n] }
        path.push(v)
      }
      if (path.length < 3) return
      pulses.push({ path, born: performance.now(), speed: 190 + Math.random() * 120, seg: grid.R })
    }

    const drawLattice = (t, live) => {
      const { cells } = grid
      ctx.lineWidth = 1
      for (const c of cells) {
        const p = reduced ? 1 : ease((t - c.delay) / CELL_IN_S)
        if (p <= 0) continue
        let a = p
        if (live && c.dim) a *= 0.12 + 0.88 * (0.5 + 0.5 * Math.cos((t / c.period) * Math.PI * 2 + c.phase))
        const s = reduced ? 1 : 0.55 + 0.45 * p // cells "snap" into place as they appear
        ctx.beginPath()
        for (let k = 0; k < 6; k++) {
          const [x, y] = c.corners.at(k)
          const px = c.cx + (x - c.cx) * s
          const py = c.cy + (y - c.cy) * s
          if (k === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(${pal.line},${(pal.lineA * a).toFixed(3)})`
        ctx.stroke()
        // nodes
        ctx.fillStyle = `rgba(${pal.line},${(pal.dotA * a).toFixed(3)})`
        for (let k = 0; k < 6; k += 2) {
          const [x, y] = c.corners.at(k)
          ctx.beginPath()
          ctx.arc(c.cx + (x - c.cx) * s, c.cy + (y - c.cy) * s, 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const drawPulses = (now) => {
      const keep = []
      ctx.lineCap = 'round'
      for (const pu of pulses) {
        const dist = ((now - pu.born) / 1000) * pu.speed
        const total = (pu.path.length - 1) * pu.seg
        const tail = pu.seg * 2.4
        if (dist - tail > total) continue
        keep.push(pu)
        // walk the path and draw the visible window [dist - tail, dist]
        for (let i = 0; i < pu.path.length - 1; i++) {
          const a0 = i * pu.seg
          const a1 = a0 + pu.seg
          const from = Math.max(a0, dist - tail)
          const to = Math.min(a1, dist)
          if (to <= from) continue
          const A = pu.path.at(i)
          const B = pu.path.at(i + 1)
          const f0 = (from - a0) / pu.seg
          const f1 = (to - a0) / pu.seg
          const x0 = A.x + (B.x - A.x) * f0
          const y0 = A.y + (B.y - A.y) * f0
          const x1 = A.x + (B.x - A.x) * f1
          const y1 = A.y + (B.y - A.y) * f1
          const strength = 1 - (dist - to) / tail // brighter towards the head
          ctx.strokeStyle = `rgba(${pal.pulse},${(pal.glow * strength).toFixed(3)})`
          ctx.lineWidth = 7
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
          ctx.strokeStyle = `rgba(${pal.pulse},${(0.95 * strength).toFixed(3)})`
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
        }
        // head spark
        if (dist <= total) {
          const i = Math.min(pu.path.length - 2, Math.floor(dist / pu.seg))
          const A = pu.path.at(i)
          const B = pu.path.at(i + 1)
          const f = (dist - i * pu.seg) / pu.seg
          const hx = A.x + (B.x - A.x) * f
          const hy = A.y + (B.y - A.y) * f
          ctx.fillStyle = `rgba(${pal.pulse},${pal.glow.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(hx, hy, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `rgba(${pal.pulse},1)`
          ctx.beginPath()
          ctx.arc(hx, hy, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      pulses = keep
    }

    // Cut the lattice out behind the copy so the text always reads cleanly.
    const protectText = () => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.drawImage(mask, 0, 0)
      ctx.restore()
    }

    const frame = (now) => {
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, W, H)
      const live = t > grid.growEnd
      drawLattice(t, live && !reduced)
      if (!reduced && t > grid.growEnd - 0.6) {
        const max = W < 768 ? 5 : 11
        if (pulses.length < max && now - lastPulseAt > 180) {
          spawnPulse()
          lastPulseAt = now
        }
        drawPulses(now)
      }
      protectText()
      if (running) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()
    if (reduced) frame(performance.now())
    else start()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced || !running) frame(performance.now())
    })
    ro.observe(canvas.parentElement)
    if (protectRef?.current) ro.observe(protectRef.current)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !document.hidden) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden || !visible ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    const mo = new MutationObserver(() => {
      pal = PALETTE[theme()]
      if (reduced || !running) frame(performance.now())
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [topOffset, protectRef])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}
