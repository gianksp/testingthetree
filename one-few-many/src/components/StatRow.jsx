import React from 'react'

export default function StatRow({ label, value, valueStyle = {} }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '8px 0', borderBottom: '1px solid #1e1c14',
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--amber)', ...valueStyle }}>
        {value}
      </span>
    </div>
  )
}
