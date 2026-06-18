import { useState, useEffect, useRef } from 'react'

export default function AnimatedNumber({ value, suffix = '', duration = 1000 }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayed(0)
          const start = performance.now()
          const from = 0
          const to = value

          const tick = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setDisplayed(Math.round(from + (to - from) * ease))
            if (progress < 1) rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
          setDisplayed(0)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <span ref={ref}>{displayed}{suffix}</span>
}
