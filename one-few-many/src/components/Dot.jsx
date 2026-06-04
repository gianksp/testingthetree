import React from 'react'

export default function Dot({ color, delay = 0, grey = false, size = 14 }) {
  const c = grey
    ? { border: '#4a4840', bg: '#2a2820' }
    : color

  return (
    <div
      className="anim-pop"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1.5px solid ${c.border}`,
        background: c.bg,
        flexShrink: 0,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    />
  )
}
