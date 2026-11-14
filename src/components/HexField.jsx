import { useEffect, useRef } from 'react'

/**
 * Animated 2D graphene lattice for the hero (canvas).
 *
 * 1. Grow: hexagonal cells appear one after another, spreading out from a seed just under the
 *    navigation bar until the whole section is covered (~2.6 s).
 * 2. Live: some cells slowly dim and recover, and pulses of "current" run along the lattice edges
 *    like circuitry, lighting the nodes they pass.
 *
 * One even, faint lattice sits behind the whole hero; pulses route around the copy. Respects
 * prefers-reduced-motion (draws the finished lattice once, no motion), pauses when off screen or
 * when the tab is hidden, follows the light/dark theme, and caps the pixel ratio at 2.
 */

const SQ3 = Math.sqrt(3)
const GROW_S = 2.6 // time for the growth to reach the farthest cell
const CELL_IN_S = 0.42 // fade/scale-in time of one cell

const PALETTE = {
  light: { line: '17,18,20', lineA: 0.072, dotA: 0.1, pulse: '74,102,184', glow: 0.18 },
  dark: { line: '255,255,255', lineA: 0.08, dotA: 0.13, pulse: '147,171,224', glow: 0.3 },
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
  // Unique edges and nodes, each drawn once (shared edges drawn per cell would come out darker)
  const edgeMap = new Map()
  const nodeMap = new Map()
  cells.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const [ax, ay] = c.corners.at(k)
      const [bx, by] = c.corners.at((k + 1) % 6)
      const ka = vKey(ax, ay)
      const kb = vKey(bx, by)
      const ek = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
      if (!edgeMap.has(ek)) edgeMap.set(ek, { ax, ay, bx, by, cells: [] })
      edgeMap.get(ek).cells.push(ci)
      if (!nodeMap.has(ka)) nodeMap.set(ka, { x: ax, y: ay, cells: [] })
      nodeMap.get(ka).cells.push(ci)
    }
  })
  const edges = [...edgeMap.values()]
  const nodes = [...nodeMap.values()]
  const vList = [...verts.entries()].map(([k, v]) => ({ k, ...v, n: [...v.n] })).filter((v) => v.x > -R && v.x < W + R && v.y > seedY - R && v.y < H + R)
  return { R, cells, edges, nodes, verts, vList, growEnd: GROW_S + 0.22 + CELL_IN_S }
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
    let keepOut = null // the copy block: pulses route around it so the text stays calm

    const measureCopy = () => {
      const el = protectRef?.current
      if (!el) return (keepOut = null)
      const pr = canvas.parentElement.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const pad = 16
      keepOut = { x0: r.left - pr.left - pad, y0: r.top - pr.top - pad, x1: r.right - pr.left + pad, y1: r.bottom - pr.top + pad }
    }
    const blocked = (v) => keepOut && v.x > keepOut.x0 && v.x < keepOut.x1 && v.y > keepOut.y0 && v.y < keepOut.y1

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
      measureCopy()
    }

    // A pulse = a random walk along lattice edges, drawn as a glowing head with a fading tail.
    const spawnPulse = () => {
      const vs = grid.vList
      if (!vs.length) return
      const free = vs.filter((x) => !blocked(x))
      if (!free.length) return
      let v = free[Math.floor(Math.random() * free.length)]
      const path = [v]
      let prev = null
      const len = 9 + Math.floor(Math.random() * 12)
      for (let i = 0; i < len; i++) {
        const opts = v.n.filter((k) => k !== prev).map((k) => grid.verts.get(k)).filter((x) => x && !blocked(x))
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
      const { cells, edges, nodes } = grid
      // per-cell visibility this frame: growth progress × slow breathing for "dim" cells
      const vis = new Float32Array(cells.length)
      cells.forEach((c, i) => {
        let a = reduced ? 1 : ease((t - c.delay) / CELL_IN_S)
        if (a > 0 && live && c.dim) a *= 0.12 + 0.88 * (0.5 + 0.5 * Math.cos((t / c.period) * Math.PI * 2 + c.phase))
        vis[i] = a
      })
      // Edges are grouped into a few strength buckets and each bucket is stroked as ONE path,
      // so the three edges meeting at a node don't stack up into a darker spot.
      const BUCKETS = 10
      const paths = Array.from({ length: BUCKETS }, () => new Path2D())
      const used = new Uint8Array(BUCKETS)
      for (const e of edges) {
        let grow = 0
        let alpha = 0
        for (const ci of e.cells) {
          grow = Math.max(grow, reduced ? 1 : ease((t - cells[ci].delay) / CELL_IN_S))
          alpha += vis[ci]
        }
        alpha = Math.max(alpha / e.cells.length, grow * 0.5)
        if (grow <= 0 || alpha <= 0.02) continue
        const bi = Math.min(BUCKETS - 1, Math.round(alpha * (BUCKETS - 1)))
        // edges draw outwards from their midpoint as the cells appear
        const mx = (e.ax + e.bx) / 2
        const my = (e.ay + e.by) / 2
        paths[bi].moveTo(mx + (e.ax - mx) * grow, my + (e.ay - my) * grow)
        paths[bi].lineTo(mx + (e.bx - mx) * grow, my + (e.by - my) * grow)
        used[bi] = 1
      }
      ctx.lineWidth = 0.7
      ctx.strokeStyle = `rgb(${pal.line})`
      for (let bi = 0; bi < BUCKETS; bi++) {
        if (!used[bi]) continue
        ctx.globalAlpha = pal.lineA * (bi / (BUCKETS - 1))
        ctx.stroke(paths[bi])
      }
      // nodes (skipped right behind the copy, where they would sit on top of the words)
      ctx.fillStyle = `rgb(${pal.line})`
      for (const n of nodes) {
        if (blocked(n)) continue
        let a = 0
        for (const ci of n.cells) a = Math.max(a, vis[ci])
        if (a <= 0.02) continue
        ctx.globalAlpha = pal.dotA * a
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
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
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
          ctx.strokeStyle = `rgba(${pal.pulse},${(0.95 * strength).toFixed(3)})`
          ctx.lineWidth = 1.2
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
          ctx.arc(hx, hy, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `rgba(${pal.pulse},1)`
          ctx.beginPath()
          ctx.arc(hx, hy, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      pulses = keep
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
