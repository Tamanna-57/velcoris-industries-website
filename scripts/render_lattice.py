"""Procedural graphene renders for the Velcoris homepage.

Usage: python3 render_lattice.py <outdir> [hero]   (pass "hero" to render only the hero still)
Outputs:
  hero.png          - wide still of a tilted graphene sheet (right-weighted)
  frames/f_XXXX.png - graphite -> graphene separation animation frames
"""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1]
os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)

BG = (10, 11, 13)
BOND = np.array([120, 160, 255])   # cool blue bonds
ATOM = np.array([235, 240, 250])
A = 1.0  # C-C distance (lattice units)


def lattice(radius):
    """Honeycomb atom positions and bond index pairs inside a disc."""
    a1 = np.array([1.5 * A, math.sqrt(3) / 2 * A])
    a2 = np.array([1.5 * A, -math.sqrt(3) / 2 * A])
    basis = [np.array([0.0, 0.0]), np.array([A, 0.0])]
    n = int(radius / A) + 3
    pts = []
    for i in range(-n, n + 1):
        for j in range(-n, n + 1):
            for b in basis:
                p = i * a1 + j * a2 + b
                if np.hypot(*p) < radius:
                    pts.append(p)
    pts = np.array(pts)
    bonds = []
    # neighbours at distance A
    from itertools import combinations
    idx = {}
    for k, p in enumerate(pts):
        idx.setdefault((round(p[0] * 2), round(p[1] * 2)), []).append(k)
    for k, p in enumerate(pts):
        cx, cy = round(p[0] * 2), round(p[1] * 2)
        for dx in range(-3, 4):
            for dy in range(-3, 4):
                for m in idx.get((cx + dx, cy + dy), []):
                    if m > k and abs(np.hypot(*(pts[m] - p)) - A) < 1e-3:
                        bonds.append((k, m))
    return pts, np.array(bonds)


def project(pts, z, yaw, pitch, cam, f, W, H, cx, cy):
    c, s = math.cos(yaw), math.sin(yaw)
    x = pts[:, 0] * c - pts[:, 1] * s
    y = pts[:, 0] * s + pts[:, 1] * c
    zz = np.full(len(pts), z)
    # pitch around x axis (sheet tilted away from camera)
    cp, sp = math.cos(pitch), math.sin(pitch)
    y2 = y * cp - zz * sp
    z2 = y * sp + zz * cp
    depth = z2 + cam
    sx = cx + f * x / depth
    sy = cy - f * y2 / depth
    return sx, sy, depth


def draw_sheet(img_arr_draw, pts, bonds, z, yaw, pitch, cam, f, W, H, cx, cy,
               alpha, ss, glow_draw=None):
    draw = img_arr_draw
    sx, sy, d = project(pts, z, yaw, pitch, cam, f, W, H, cx, cy)
    dmin, dmax = d.min(), d.max()
    fade = 1 - (d - dmin) / max(dmax - dmin, 1e-6) * 0.75  # far = dimmer
    r = np.hypot(pts[:, 0], pts[:, 1])
    edge = np.clip((r.max() - r) / (r.max() * 0.35), 0, 1)  # soft disc edge
    w = fade * edge * alpha
    for k, m in bonds:
        a = min(w[k], w[m])
        if a < 0.02:
            continue
        col = tuple(int(BG[i] + (BOND[i] - BG[i]) * a) for i in range(3))
        draw.line([(sx[k], sy[k]), (sx[m], sy[m])], fill=col, width=max(1, int(1.6 * ss * (f / d[k]) / 90)))
    for k in np.argsort(-d):
        a = w[k]
        if a < 0.02:
            continue
        rad = 2.6 * ss * (f / d[k]) / 90
        col = tuple(int(BG[i] + (ATOM[i] - BG[i]) * a) for i in range(3))
        draw.ellipse([sx[k] - rad, sy[k] - rad, sx[k] + rad, sy[k] + rad], fill=col)


def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def render(W, H, ss, layers, cx, cy, pts, bonds, path, glow=True):
    img = Image.new("RGB", (W * ss, H * ss), BG)
    d = ImageDraw.Draw(img)
    for (z, yaw, pitch, cam, f, alpha) in layers:
        draw_sheet(d, pts, bonds, z, yaw, pitch, cam, f * ss, W * ss, H * ss,
                   cx * ss, cy * ss, alpha, ss)
    img = img.resize((W, H), Image.LANCZOS)
    if glow:
        g = img.filter(ImageFilter.GaussianBlur(10))
        img = Image.blend(img, Image.fromarray(np.maximum(np.asarray(img), np.asarray(g))), 0.5)
    img.save(path)


# ---------- hero still: lattice fills the whole frame ----------
pts_h, bonds_h = lattice(30)
render(1920, 1080, 2,
       [(0.0, 0.3, 0.98, 30.0, 1500, 1.0)],
       cx=1000, cy=380, pts=pts_h, bonds=bonds_h,
       path=os.path.join(OUT, "hero.png"))
print("hero done")
if len(sys.argv) > 2 and sys.argv[2] == "hero":
    sys.exit(0)

# ---------- animation: graphite stack -> isolated graphene ----------
pts, bonds = lattice(9)
W, H, FPS, SEC = 1280, 720, 24, 8
N = FPS * SEC
L = 7
for fi in range(N):
    t = fi / (N - 1)
    sep = ease((t - 0.12) / 0.5)          # layers pull apart
    keep = ease((t - 0.55) / 0.3)          # outer layers fade away
    yaw = 0.25 + t * 0.5
    pitch = 1.12 - 0.35 * ease((t - 0.5) / 0.5)
    cam = 22.0 - 8.0 * ease((t - 0.55) / 0.45)
    layers = []
    for i in range(L):
        off = (i - (L - 1) / 2)
        z = off * (0.34 + 1.5 * sep)        # 0.34 nm graphite spacing -> apart
        alpha = 1.0 if i == L // 2 else (1 - keep) * 0.9
        layers.append((z, yaw, pitch, cam, 900, alpha))
    layers.sort(key=lambda l: -l[0])  # far first
    render(W, H, 2, layers, W / 2, H / 2 + 20, pts, bonds,
           os.path.join(OUT, "frames", f"f_{fi:04d}.png"), glow=False)
    if fi % 24 == 0:
        print("frame", fi)
print("done")
