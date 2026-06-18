import { useState, useEffect } from 'react'
import TypewriterText from './TypewriterText'
import AnimatedNumber from './AnimatedNumber'

const USERNAME = 'Gambilo3'

const FALLBACK_DATA = {"name":"Gambilo3","addedAt":1630078407023,"typingStats":{"completedTests":166,"startedTests":672,"timeTyping":6656.419999999999},"personalBests":{"time":{"15":[{"acc":100,"consistency":89.91,"difficulty":"normal","lazyMode":false,"language":"english","punctuation":false,"raw":144.1,"wpm":144.1,"numbers":false,"timestamp":1781256632756}],"30":[{"acc":96.76,"consistency":91.63,"difficulty":"normal","language":"english","punctuation":false,"raw":122.8,"wpm":117.6,"timestamp":1755773067285,"lazyMode":false,"numbers":false}],"60":[{"acc":94.76,"consistency":81.99,"difficulty":"normal","lazyMode":false,"language":"english","punctuation":false,"raw":112.79,"wpm":104.59,"numbers":false,"timestamp":1731923597893}],"120":[{"acc":91.56,"consistency":80.32,"difficulty":"normal","lazyMode":false,"language":"english","punctuation":false,"raw":110.3,"wpm":94.3,"numbers":false,"timestamp":1731923780385}]},"words":{"10":[{"acc":100,"consistency":96.41,"difficulty":"normal","lazyMode":false,"language":"english","punctuation":false,"raw":149.22,"wpm":149.22,"numbers":false,"timestamp":1781157518041}],"50":[{"acc":92.19,"consistency":79.65,"difficulty":"normal","lazyMode":false,"language":"english","punctuation":false,"raw":126.81,"wpm":108.48,"numbers":false,"timestamp":1731923912582}]}},"xp":45312,"streak":1,"maxStreak":4}

const timeLabels = { '15': '15s', '30': '30s', '60': '60s', '120': '120s' }

function useMonkeytypeStats() {
  const [data, setData] = useState(FALLBACK_DATA)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    fetch(`https://api.monkeytype.com/users/${USERNAME}/profile`, {
      signal: controller.signal,
    })
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`)
        return r.json()
      })
      .then(res => {
        clearTimeout(timeout)
        if (res.data) setData(res.data)
      })
      .catch(() => {
        clearTimeout(timeout)
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return { data, error }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function WpmBar({ label, wpm, acc, best }) {
  const pct = best > 0 ? (wpm / best) * 100 : 0
  return (
    <div className="mt-wpm-row">
      <span className="mt-wpm-label">{label}</span>
      <div className="mt-wpm-bar-track">
        <div className="mt-wpm-bar-fill" style={{ '--bar-pct': `${pct}%` }} />
      </div>
      <span className="mt-wpm-value">{wpm}</span>
      <span className="mt-wpm-acc">{acc}%</span>
    </div>
  )
}

export default function MonkeytypeWidget() {
  const { data } = useMonkeytypeStats()

  const timeBests = data.personalBests?.time || {}
  const timeEntries = Object.entries(timeBests)
    .map(([k, v]) => ({ key: timeLabels[k] || `${k}s`, ...v[0] }))
    .sort((a, b) => Number(a.key) - Number(b.key))
  const bestWpm = timeEntries.length > 0 ? Math.max(...timeEntries.map(r => r.wpm)) : 0
  const bestAcc = timeEntries.length > 0
    ? timeEntries.reduce((a, b) => (a.wpm > b.wpm ? a : b))
    : null

  return (
    <section className="mt-section">
      <div className="section-header reveal">
        <p className="section-label">Typing Speed</p>
        <TypewriterText text="Typing Stats" className="section-heading" speed={110} />
      </div>
      <a
        href={`https://monkeytype.com/profile/${USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card mt-card reveal"
      >
        <div className="mt-top">
          <div className="mt-bests">
            <span className="mt-best-label">best</span>
            <span className="mt-best-wpm">{Math.round(bestWpm)}</span>
            <span className="mt-best-unit">wpm</span>
            {bestAcc && (
              <span className="mt-best-acc">{bestAcc.acc}% acc</span>
            )}
          </div>
          <div className="mt-meta">
            <div className="mt-meta-item">
              <span className="mt-meta-val"><AnimatedNumber value={data.typingStats?.completedTests || 0} /></span>
              <span className="mt-meta-label">tests</span>
            </div>
            <div className="mt-meta-item">
              <span className="mt-meta-val">{formatTime(data.typingStats?.timeTyping || 0)}</span>
              <span className="mt-meta-label">typed</span>
            </div>
            <div className="mt-meta-item">
              <span className="mt-meta-val"><AnimatedNumber value={data.xp || 0} suffix="" /></span>
              <span className="mt-meta-label">xp</span>
            </div>
          </div>
        </div>
        <div className="mt-divider" />
        <div className="mt-section-label">Time</div>
        <div className="mt-wpm-list">
          {timeEntries.map(r => (
            <WpmBar key={r.key} label={r.key} wpm={Math.round(r.wpm)} acc={r.acc} best={bestWpm} />
          ))}
        </div>
      </a>
    </section>
  )
}
