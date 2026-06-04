import React from 'react'

export default function SliderInput({ label, value, onChange, leftLabel, rightLabel, hint }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
      </div>
      <input
        type="range" min="0" max="1" step="0.01"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>{leftLabel}</span>
        <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>{rightLabel}</span>
      </div>
      {hint && <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  )
}
