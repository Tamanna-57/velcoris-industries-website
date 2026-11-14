import { useEffect, useRef } from 'react'

/**
 * Animated version of the hero lattice photo: a dark graphene honeycomb seen in perspective.
 * Thin lines, a slow glide towards the viewer, a gentle surface wave, and a few small sparks
 * that run along the bonds. Pauses off screen / in background tabs; reduced motion draws one frame.
 */
const BG = '#0a0b0d'
const LINE = '200,212,240'
const SPARK = '132,162,255'
const BUCKETS = 8
const SPEED = 0.07 // world units per second (lattice period is ~1.73 * size)

export default function LatticeField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, dpr = 1, raf = 0, running = false, visible = true
    let g = null // geometry
    let sparks = []
    let start = performance.now()
    let lastSpark = 0

    function build() {
      const mobile = W < 768
      const f = H * 1.2
      const horizon = -0.45 * H
      const zNear = f / (H - horizon)
      const zFar = f / (0 - horizon)
      const target = mobile ? W / 9 : Math.max(52, W / 24) // on-screen width of a near hexagon
      const s = (target * zNear) / (2 * f)
      const rowH = Math.sqrt(3) * s
      const colW = 1.5 * s
      const halfX = (W / 2) * (zFar / f) + 2 * s
      const cols = Math.ceil(halfX / colW) + 1
      const yMin = zNear - 2 * rowH
      const rows = Math.ceil((zFar - yMin) / rowH) + 3

      const vMap = new Map()
      const vx = []
      const vy = []
      const adj = []
      const edges = []
      const eSet = new Set()
      const vid = (x, y) => {
        const k = Math.round(x * 1e4 / s) + ':' + Math.round(y * 1e4 / s)
        let id = vMap.get(k)
        if (id === undefined) {
          id = vx.length
          vMap.set(k, id)
          vx.push(x)
          vy.push(y)
          adj.push([])
        }
        return id
      }
      for (let c = -cols; c <= cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cx = c * colW
          const cy = yMin + r * rowH + (Math.abs(c) % 2 ? rowH / 2 : 0)
          const ids = []
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI / 3) * k
            ids.push(vid(cx + s * Math.cos(a), cy + s * Math.sin(a)))
          }
          for (let k = 0; k < 6; k++) {
            const a = ids[k], b = ids[(k + 1) % 6]
            const key = a < b ? a + ',' + b : b + ',' + a
            if (eSet.has(key)) continue
            eSet.add(key)
            edges.push(a, b)
            adj[a].push(b)
            adj[b].push(a)
          }
        }
      }
      const n = vx.length
      g = {
        f, horizon, zNear, zFar, s, rowH, mobile,
        vx: Float32Array.from(vx), vy: Float32Array.from(vy), adj, edges: Uint32Array.from(edges),
        px: new Float32Array(n), py: new Float32Array(n), pz: new Float32Array(n), on: new Uint8Array(n),
        paths: Array.from({ length: BUCKETS }, () => null),
        wave: 0.05, // surface wave height (camera height = 1)
      }
    }

    function height(x, y, t) {
      return g.wave * (Math.sin(x * 2.1 + y * 1.3 - t * 0.55) * 0.6 + Math.sin(x * -1.2 + y * 2.6 - t * 0.35) * 0.4)
    }

    function project(x, y, t) {
      const z = y
      if (z <= 0.05) return null
      const h = height(x, y, t)
      return [W / 2 + (g.f * x) / z, g.horizon + (g.f * (1 - h)) / z, z]
    }

    function depthA(z) {
      // 1 near → 0.22 far
      const k = Math.min(1, Math.max(0, (z - g.zNear) / (g.zFar - g.zNear)))
      return 1 - 0.78 * k
    }

    function resize() {
      const r = canvas.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      // Big canvases cap at 1.5x: hairlines stay crisp and it keeps the fill cost down on retina laptops
      dpr = Math.min(W > 1000 ? 1.5 : 2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      sparks = []
    }

    function frame(now) {
      const t = reduced ? 0 : (now - start) / 1000
      const total = t * SPEED
      const off = total % g.rowH
      const { vx, vy, px, py, pz, on, edges } = g
      const n = vx.length

      // Project every vertex once
      for (let i = 0; i < n; i++) {
        const y = vy[i] - off
        if (y < g.zNear * 0.6) { on[i] = 0; continue }
        const h = height(vx[i], vy[i], t)
        const sx = W / 2 + (g.f * vx[i]) / y
        const sy = g.horizon + (g.f * (1 - h)) / y
        px[i] = sx; py[i] = sy; pz[i] = y
        on[i] = sx > -60 && sx < W + 60 && sy > -60 && sy < H + 60 ? 1 : 0
      }

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)

      // Edges, grouped by depth so overlapping strokes never stack
      for (let b = 0; b < BUCKETS; b++) g.paths[b] = new Path2D()
      for (let e = 0; e < edges.length; e += 2) {
        const a = edges[e], c = edges[e + 1]
        if (!on[a] && !on[c]) continue
        const z = (pz[a] + pz[c]) / 2
        const k = Math.min(BUCKETS - 1, Math.floor(((z - g.zNear) / (g.zFar - g.zNear)) * BUCKETS))
        const p = g.paths[Math.max(0, k)]
        p.moveTo(px[a], py[a])
        p.lineTo(px[c], py[c])
      }
      for (let b = 0; b < BUCKETS; b++) {
        const z = g.zNear + ((b + 0.5) / BUCKETS) * (g.zFar - g.zNear)
        const a = depthA(z)
        ctx.strokeStyle = `rgba(${LINE},${(0.5 * a).toFixed(3)})`
        ctx.lineWidth = 0.65 - 0.25 * (b / BUCKETS)
        ctx.stroke(g.paths[b])
      }

      // Junction dots, batched by depth (one fill per bucket)
      for (let b = 0; b < BUCKETS; b++) g.paths[b] = new Path2D()
      for (let i = 0; i < n; i++) {
        if (!on[i]) continue
        const k = Math.min(BUCKETS - 1, Math.max(0, Math.floor(((pz[i] - g.zNear) / (g.zFar - g.zNear)) * BUCKETS)))
        const r = 1.7 - 1.1 * (k / BUCKETS)
        g.paths[k].rect(px[i] - r / 2, py[i] - r / 2, r, r)
      }
      for (let b = 0; b < BUCKETS; b++) {
        const z = g.zNear + ((b + 0.5) / BUCKETS) * (g.zFar - g.zNear)
        ctx.fillStyle = `rgba(${LINE},${(0.75 * depthA(z)).toFixed(3)})`
        ctx.fill(g.paths[b])
      }

      if (!reduced) drawSparks(now, t, total)
    }

    function spawnSpark(total, now) {
      const { adj, on, px } = g
      // start somewhere visible, biased to the right half where the lattice is clearest
      for (let tries = 0; tries < 40; tries++) {
        const i = (Math.random() * g.vx.length) | 0
        if (!on[i] || px[i] < W * (g.mobile ? 0 : 0.45)) continue
        const path = [i]
        let prev = -1, cur = i
        const len = 4 + ((Math.random() * 4) | 0)
        for (let k = 0; k < len; k++) {
          const opts = adj[cur].filter((v) => v !== prev)
          if (!opts.length) break
          prev = cur
          cur = opts[(Math.random() * opts.length) | 0]
          path.push(cur)
        }
        if (path.length < 3) continue
        const base = Math.floor(total / g.rowH) * g.rowH
        sparks.push({ path, base, born: now, dur: 2200 + Math.random() * 1400 })
        return
      }
    }

    function drawSparks(now, t, total) {
      const max = g.mobile ? 3 : 7
      if (sparks.length < max && now - lastSpark > 420) {
        spawnSpark(total, now)
        lastSpark = now
      }
      sparks = sparks.filter((sp) => now - sp.born < sp.dur)
      ctx.lineCap = 'round'
      for (const sp of sparks) {
        const life = Math.max(0, (now - sp.born) / sp.dur) // 0..1
        const pts = []
        for (const id of sp.path) {
          const p = project(g.vx[id], g.vy[id] - (total - sp.base), t)
          if (!p) break
          pts.push(p)
        }
        if (pts.length < 2) continue
        const segs = pts.length - 1
        const head = life * (segs + 1.2) // travels the path, then trails off the end
        const TAIL = 1.7
        const tail = head - TAIL // short tail, under two bonds long
        const fade = Math.sin(Math.PI * Math.min(1, life * 1.05))
        for (let s = 0; s < segs; s++) {
          const a0 = Math.max(s, tail), a1 = Math.min(s + 1, head)
          if (a1 <= a0) continue
          const p0 = pts[s], p1 = pts[s + 1]
          const u0 = a0 - s, u1 = a1 - s
          const x0 = p0[0] + (p1[0] - p0[0]) * u0, y0 = p0[1] + (p1[1] - p0[1]) * u0
          const x1 = p0[0] + (p1[0] - p0[0]) * u1, y1 = p0[1] + (p1[1] - p0[1]) * u1
          const da = depthA((p0[2] + p1[2]) / 2)
          const grad = ctx.createLinearGradient(x0, y0, x1, y1)
          const near = (a1 - tail) / TAIL
          const far = (a0 - tail) / TAIL
          grad.addColorStop(0, `rgba(${SPARK},${(far * fade * da).toFixed(3)})`)
          grad.addColorStop(1, `rgba(${SPARK},${(near * fade * da).toFixed(3)})`)
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          // faint soft halo, then a thin bright core
          ctx.globalAlpha = 0.18
          ctx.strokeStyle = grad
          ctx.lineWidth = 2.6 + 1.4 * da
          ctx.stroke()
          ctx.globalAlpha = 1
          ctx.lineWidth = 0.8 + 0.5 * da
          ctx.stroke()
        }
        // tiny bright head while it is on the path
        if (head <= segs) {
          const s = Math.min(segs - 1, Math.floor(head))
          const u = head - s
          const p0 = pts[s], p1 = pts[s + 1]
          const da = depthA(p0[2])
          ctx.fillStyle = `rgba(225,233,255,${(fade * da).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, 0.9 + 0.7 * da, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    function loop(now) {
      frame(now)
      if (running) raf = requestAnimationFrame(loop)
    }
    function play() {
      if (reduced) { frame(performance.now()); return }
      if (running || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    function pause() {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()
    play()
    const ro = new ResizeObserver(() => { resize(); if (!running) frame(performance.now()) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : pause() })
    io.observe(canvas)
    const onVis = () => (document.hidden ? pause() : play())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden="true" />
}
