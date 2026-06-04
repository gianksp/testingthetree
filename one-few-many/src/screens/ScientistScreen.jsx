import React, { useState } from 'react'
import Card from '../components/Card'
import DotField from '../components/DotField'
import GuessButtons from '../components/GuessButtons'

export default function ScientistScreen({ result, onGuess }) {
  const [selected, setSelected] = useState(null)

  const survivingDots = result.snapshots[result.snapshots.length - 1].dots

  return (
    <div className="anim-fade" style={screen}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 28, marginTop: 16 }}>
          <div style={label}>Act II</div>
          <h1 style={h1}>You are the scientist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>
            4 billion years have passed. The early history is gone.
            All you can see is what survived.
          </p>
        </div>

        <Card style={{ marginBottom: 28 }}>
          <div style={label}>Evidence available</div>
          <div style={{ marginTop: 12, marginBottom: 14 }}>
            <DotField dots={survivingDots} grey />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            All surviving lineages share a universal genetic code, common biochemistry, and homologous proteins.
          </p>
        </Card>

        <div style={label}>How many independent origins happened?</div>
        <div style={{ marginTop: 12 }}>
          <GuessButtons selected={selected} onSelect={setSelected} />
        </div>
      </div>

      <div style={{ paddingTop: 24 }}>
        <button
          style={{ ...btnPrimary, opacity: selected === null ? 0.4 : 1, pointerEvents: selected === null ? 'none' : 'auto' }}
          onClick={() => onGuess(selected)}
        >
          Submit guess →
        </button>
      </div>
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
