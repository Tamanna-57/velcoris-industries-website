// Image delivery through Vercel Image Optimization (configured in vercel.json → "images").
// Remote originals (the live site's 120 KB–1.9 MB JPEG/PNG photos) are fetched once by Vercel,
// resized to the requested width, converted to WebP and cached at the edge (Mumbai) for 31 days,
// so a first-time visitor downloads ~30–90 KB per photo instead of the original file.
// On localhost (vite dev / preview) there is no optimizer, so the original URL is used.

export const SIZES = [320, 480, 640, 960, 1280, 1600] // must match vercel.json images.sizes
const QUALITY = 70 // must be listed in vercel.json images.qualities

const enabled =
  typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)

const snap = (w) => SIZES.find((s) => s >= w) ?? SIZES.at(-1)

/** URL of `src` resized to (at least) `w` px wide. */
export function opt(src, w) {
  if (!enabled || !src) return src
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${snap(w)}&q=${QUALITY}`
}

/** srcset string for the given widths. */
export function srcSet(src, widths) {
  if (!enabled || !src) return undefined
  return widths.map((w) => `${opt(src, w)} ${snap(w)}w`).join(', ')
}
