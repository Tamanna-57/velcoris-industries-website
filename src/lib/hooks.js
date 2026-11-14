import { useEffect, useRef, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Adds `is-in` to every `.reveal` inside the returned ref once it nears the viewport. */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.matches('.reveal') ? [root] : [...root.querySelectorAll('.reveal')]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px 15% 0px' }, // start slightly *before* entering view
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

/** True once the element has been within `margin` of the viewport. */
export function useInView(margin = '0px', once = true) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting)
        if (e.isIntersecting && once) io.disconnect()
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, once])
  return [ref, inView]
}
