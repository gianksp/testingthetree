import React from 'react'

export default function Card({ children, highlight = false, dim = false, style = {} }) {
  return (
    <div style={{
      background: dim ? 'var(--bg-card-2)' : 'var(--bg-card)',
      border: `1px solid ${highlight ? 'var(--border-hl)' : 'var(--border)'}`,
      borderRadius: 6,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  )
}
