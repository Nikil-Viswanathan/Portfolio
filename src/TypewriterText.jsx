import { useState, useEffect, useRef } from 'react'

export default function TypewriterText({ text, as: Tag = 'h2', className, speed = 50 }) {
  const [displayed, setDisplayed] = useState('')
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
        } else {
          setActive(false)
          setDisplayed('')
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    let i = 0
    setDisplayed('')
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [active, text, speed])

  return (
    <Tag ref={ref} className={className}>
      {displayed}
      <span className="typewriter-cursor" />
    </Tag>
  )
}
