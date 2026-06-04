import React from 'react'
import Card from '../components/Card'
import { GUESS_LABELS, classifyOrigins } from '../engine/simulate'

export default function InsightScreen({ history, onRestart }) {
  const correct = history.filter(h => classifyOrigins(h.result.origins) === h.guess).length
  const avgOrigins = Math.round(history.reduce((s, h) => s + h.result.origins, 0) / history.length)

  const guessCounts  = [0,1,2,3].map(g => history.filter(h => h.guess === g).length)
  const actualCounts = [0,1,2,3].map(g => history.filter(h => classifyOrigins(h.result.origins) === g).length)
  const maxCount = Math.max(...guessCounts, ...actualCounts, 1)
  const shortLabels  = ['1', '2–10', '10–100', '100+']

  return (
    <div className="anim-fade" style={screen}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 28, marginTop: 16 }}>
          <div style={label}>Results</div>
          <h1 style={h1}>{correct}/{history.length} correct</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>
            Average origins per world: <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>{avgOrigins}</span>
          </p>
        </div>

        <Card style={{ marginBottom: 20 }}>
          <div style={label}>Your guesses vs reality</div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '48px 1fr 1fr', gap: '6px 8px', alignItems: 'center' }}>
            <div />
            <div style={colHead}>guessed</div>
            <div style={{ ...colHead, color: 'var(--amber)' }}>actual</div>

            {shortLabels.map((l, i) => (
              <React.Fragment key={i}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>{l}</div>
                <Bar count={guessCounts[i]} max={maxCount} color="var(--text-faint)" />
                <Bar count={actualCounts[i]} max={maxCount} color="var(--amber)" />
              </React.Fragment>
            ))}
          </div>
        </Card>

        <Card dim style={{ marginBottom: 20, borderColor: 'rgba(200,168,75,0.15)' }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--amber)', fontStyle: 'italic', marginBottom: 8 }}>
            "Many radically different histories converge to the same surviving evidence."
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            The question isn't whether a single origin happened.
            It's whether surviving evidence can tell us either way.
          </p>
        </Card>
      </div>

      <button style={btnPrimary} onClick={onRestart}>Run more worlds →</button>
    </div>
  )
}

function Bar({ count, max, color }) {
  return (
    <div style={{ background: 'var(--border)', borderRadius: 2, height: 22, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${(count / max) * 100}%`,
        background: color, opacity: 0.5, borderRadius: 2,
        transition: 'width 1s ease',
      }} />
      <span style={{
        position: 'absolute', right: 6, top: 4,
        fontSize: 11, fontFamily: 'var(--font-mono)', color,
      }}>
        {count}
      </span>
    </div>
  )
}

const screen   = { minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: 440, margin: '0 auto' }
const label    = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: 8 }
const h1       = { fontSize: 26, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }
const colHead  = { fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textAlign: 'center' }
const btnPrimary = {
  background: 'var(--amber)', color: '#0d0d0b', fontSize: 18, fontWeight: 600,
  padding: '16px 24px', borderRadius: 4, width: '100%', letterSpacing: '0.02em',
  fontFamily: 'var(--font-serif)',
}
