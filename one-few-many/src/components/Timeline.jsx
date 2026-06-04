import React from 'react'
import DotField from './DotField'

export default function Timeline({ snapshots, visibleCount = Infinity, barProgress = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {snapshots.map((snap, i) => {
        const visible = i < visibleCount
        const progress = barProgress[i] ?? 100
        return (
          <div
            key={i}
            style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              opacity: visible ? 1 : 0.2,
              transition: 'opacity 0.4s',
            }}
          >
            <div style={{
              width: 60, fontSize: 11,
              fontFamily: 'var(--font-mono)', color: 'var(--text-faint)',
              paddingTop: 2, flexShrink: 0,
            }}>
              {snap.label}
            </div>
            <div style={{ flex: 1 }}>
              {barProgress.length > 0 && (
                <div style={{
                  height: 3, background: 'var(--border)', borderRadius: 2,
                  overflow: 'hidden', marginBottom: 6,
                }}>
                  <div style={{
                    height: '100%', background: 'var(--amber)', borderRadius: 2,
                    width: `${progress}%`, transition: 'width 0.7s ease',
                  }} />
                </div>
              )}
              {snap.dots.length > 0
                ? <DotField dots={snap.dots} />
                : <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>extinct</span>
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}
