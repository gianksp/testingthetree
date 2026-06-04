import React, { useState } from 'react'
import SliderInput from '../components/SliderInput'
import Card from '../components/Card'

export default function NatureScreen({ onRun }) {
  const [params, setParams] = useState({
    abioDifficulty: 0.5,
    extinctionRate: 0.6,
    competitionIntensity: 0.5,
  })
  const set = (k, v) => setParams(p => ({ ...p, [k]: v }))

  return (
    <div className="anim-fade" style={screen}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 32, marginTop: 16 }}>
          <div style={label}>Act I</div>
          <h1 style={h1}>You are Nature</h1>
          <p style={body}>
            Set the conditions of early Earth. Press run — and watch what happens over 4 billion years.
          </p>
        </div>

        <Card style={{ marginBottom: 14 }}>
          <SliderInput
            label="Abiogenesis difficulty"
            value={params.abioDifficulty}
            onChange={v => set('abioDifficulty', v)}
            leftLabel="Easy" rightLabel="Hard"
            hint="How hard is it for life to start?"
          />
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <SliderInput
            label="Extinction rate"
            value={params.extinctionRate}
            onChange={v => set('extinctionRate', v)}
            leftLabel="Low" rightLabel="High"
            hint="How hostile is the environment?"
          />
        </Card>

        <Card style={{ marginBottom: 36 }}>
          <SliderInput
            label="Competition intensity"
            value={params.competitionIntensity}
            onChange={v => set('competitionIntensity', v)}
            leftLabel="Low" rightLabel="High"
            hint="How hard do lineages outcompete each other?"
          />
        </Card>
      </div>

      <button style={btnPrimary} onClick={() => onRun(params)}>
        Run the world →
      </button>
    </div>
  )
}

const screen = { minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: 440, margin: '0 auto' }
const label  = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: 8 }
const h1     = { fontSize: 28, fontWeight: 600, lineHeight: 1.2, marginBottom: 10 }
const body   = { color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }
const btnPrimary = {
  background: 'var(--amber)', color: '#0d0d0b', fontSize: 18, fontWeight: 600,
  padding: '16px 24px', borderRadius: 4, width: '100%', letterSpacing: '0.02em',
  fontFamily: 'var(--font-serif)',
}
