import React, { useEffect, useState } from 'react'

function formatCount(n) {
  if (n === 0) return 'Orₚ'
  const val = Math.pow(10, n)
  if (val >= 1e6) return `Orₚ × ${val.toExponential(0).replace('e+', '×10^').replace('e', '×10^')}`
  return `Orₚ × ${val.toLocaleString()}`
}

export default function OrCounter({ n }) {
  const dotCount = Math.min(n <= 2 ? Math.pow(10, n) : 50, 50)
  const [dots, setDots] = useState([])

  useEffect(() => {
    setDots([])
    let i = 0
    const interval = setInterval(() => {
      if (i >= dotCount) { clearInterval(interval); return }
      setDots(d => [...d, i])
      i++
    }, n <= 1 ? 80 : n <= 2 ? 30 : 12)
    return () => clearInterval(interval)
  }, [n, dotCount])

  const colors = [
    '#c8a84b','#5a8fc8','#8fc85a','#c85a8f',
    '#8f5ac8','#5ac8c8','#c8705a','#a8c85a',
  ]

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 22,
        color: 'var(--amber)',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: '0.02em',
      }}>
        {formatCount(n)}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5,
        minHeight: 60,
        alignContent: 'flex-start',
      }}>
        {dots.map((d, i) => (
          <div
            key={d}
            className="pop-in"
            style={{
              width: 10, height: 10,
              borderRadius: '50%',
              border: `1.5px solid ${colors[i % colors.length]}`,
              background: colors[i % colors.length] + '22',
              animationDelay: `${i * 10}ms`,
              animationFillMode: 'both',
              flexShrink: 0,
            }}
          />
        ))}
        {n > 2 && dots.length >= dotCount && (
          <div style={{
            fontSize: 13,
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            alignSelf: 'center',
            marginLeft: 4,
          }}>
            … and {(Math.pow(10, n) - dotCount).toLocaleString()} more
          </div>
        )}
      </div>
    </div>
  )
}
