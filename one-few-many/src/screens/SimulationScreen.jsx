import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Timeline from '../components/Timeline'
import StatRow from '../components/StatRow'

export default function SimulationScreen({ result, onContinue }) {
  const [step, setStep] = useState(0)
  const [bars, setBars] = useState(result.snapshots.map(() => 0))

  useEffect(() => {
    if (step >= result.snapshots.length) return
    const delay = step === 0 ? 300 : 250
    const t = setTimeout(() => {
      setBars(b => b.map((v, i) => (i === step ? 100 : v)))
      setTimeout(() => setStep(s => s + 1), 650)
    }, delay)
    return () => clearTimeout(t)
  }, [step, result.snapshots.length])

  const done = step >= result.snapshots.length

  return (
    <div className="anim-fade" style={screen}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 28, marginTop: 16 }}>
          <div style={label}>Simulation running</div>
          <h1 style={h1}>4 billion years</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            Each colour = an independent origin of life.
          </p>
        </div>

        <Card style={{ marginBottom: 20 }}>
          <Timeline
            snapshots={result.snapshots}
            visibleCount={step}
            barProgress={bars}
          />
        </Card>

        {done && (
          <Card highlight style={{ marginBottom: 24 }} className="anim-fade">
            <StatRow label="Origins that arose" value={result.origins} />
            <StatRow label="Surviving today" value={result.final} style={{ borderBottom: 'none' }} />
          </Card>
        )}
      </div>

      {done && (
        <button className="anim-fade" style={btnPrimary} onClick={onContinue}>
          Now become the scientist →
        </button>
      )}
    </div>
  )
}

const screen = { minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: 440, margin: '0 auto' }
const label  = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: 8 }
const h1     = { fontSize: 26, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }
const btnPrimary = {
  background: 'var(--amber)', color: '#0d0d0b', fontSize: 18, fontWeight: 600,
  padding: '16px 24px', borderRadius: 4, width: '100%', letterSpacing: '0.02em',
  fontFamily: 'var(--font-serif)',
}
