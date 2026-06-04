import React from 'react'
import Card from '../components/Card'
import StatRow from '../components/StatRow'
import Timeline from '../components/Timeline'
import DarwinReaction from '../components/DarwinReaction'
import ProgressBar from '../components/ProgressBar'
import { GUESS_LABELS, classifyOrigins } from '../engine/simulate'
import { TOTAL_ROUNDS } from '../store/useGameStore'

export default function RevealScreen({ result, guess, round, onNext }) {
  const actual = classifyOrigins(result.origins)
  const correct = guess === actual

  return (
    <div className="anim-fade" style={screen}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 20, marginTop: 16 }}>
          <div style={label}>Round {round} of {TOTAL_ROUNDS}</div>
          <h1 style={h1}>Reveal</h1>
        </div>

        <DarwinReaction origins={result.origins} guess={guess} />

        <Card highlight={correct} style={{ marginBottom: 14 }}>
          <StatRow
            label="Your guess"
            value={GUESS_LABELS[guess]}
            valueStyle={{ fontSize: 14, color: correct ? 'var(--green)' : 'var(--red)' }}
          />
          <StatRow label="Actual origins" value={result.origins} />
          <StatRow
            label="Survived to today"
            value={result.final}
            valueStyle={{ fontSize: 14, borderBottom: 'none' }}
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <div style={label}>Full timeline</div>
          <div style={{ marginTop: 12 }}>
            <Timeline snapshots={result.snapshots} />
          </div>
        </Card>

        <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 24 }}>
          The surviving evidence — shared genetics, universal code — looks identical regardless of whether{' '}
          {result.origins === 1 ? 'one' : result.origins} origin{result.origins !== 1 ? 's' : ''} arose.
          That's the point.
        </p>
      </div>

      <ProgressBar round={round} />
      <div style={{ height: 16 }} />
      <button style={btnPrimary} onClick={onNext}>
        {round >= TOTAL_ROUNDS ? 'See your results →' : 'Next world →'}
      </button>
    </div>
  )
}

const screen = { minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: 440, margin: '0 auto' }
const label  = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: 8 }
const h1     = { fontSize: 26, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }
const btnPrimary = {
  background: 'var(--amber)', color: '#0d0d0b', fontSize: 18, fontWeight: 600,
  padding: '16px 24px', borderRadius: 4, width: '100%', letterSpacing: '0.02em',
  fontFamily: 'var(--font-serif)',
}
