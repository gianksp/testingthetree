import React from 'react'
import { GUESS_LABELS } from '../engine/simulate'

export default function GuessButtons({ selected, onSelect, revealed = false, correct = null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {GUESS_LABELS.map((label, i) => {
        let borderColor = 'var(--border)'
        let bg = 'var(--bg-card)'
        let color = 'var(--text)'

        if (revealed) {
          if (i === correct) { borderColor = '#4a8c5c'; bg = '#0e1a12' }
          else if (i === selected && i !== correct) { borderColor = '#7a2020'; bg = '#1a0e0e'; color = 'var(--text-muted)' }
        } else if (selected === i) {
          borderColor = 'var(--amber)'
          bg = '#1e1c14'
        }

        return (
          <button
            key={i}
            onClick={() => !revealed && onSelect(i)}
            style={{
              background: bg,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 6,
              padding: '16px',
              textAlign: 'left',
              width: '100%',
              color,
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              transition: 'border-color 0.15s, background 0.15s',
              cursor: revealed ? 'default' : 'pointer',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
