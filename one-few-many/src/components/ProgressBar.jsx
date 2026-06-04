import React from 'react'
import { TOTAL_ROUNDS } from '../store/useGameStore'

export default function ProgressBar({ round }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i < round ? 'var(--amber)' : i === round ? 'rgba(200,168,75,0.4)' : 'var(--border)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}
