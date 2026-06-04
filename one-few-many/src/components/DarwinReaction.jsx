import React from 'react'
import { classifyOrigins } from '../engine/simulate'

function getReaction(origins, guess) {
  const actual = classifyOrigins(origins)
  const correct = guess === actual
  const hugeGap = origins > 10 && guess === 0

  if (correct && origins <= 3) return { emoji: '👍', quote: '"One primordial form" — as expected.' }
  if (correct)                  return { emoji: '👍', quote: '"A few forms or one" — still fine.' }
  if (hugeGap)                  return { emoji: '😠', quote: '"Are you nuts?"' }
  if (guess < actual)           return { emoji: '🤔', quote: 'More origins than you thought.' }
  return                               { emoji: '🤔', quote: 'Fewer origins than you thought.' }
}

export default function DarwinReaction({ origins, guess }) {
  const { emoji, quote } = getReaction(origins, guess)
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ fontSize: 56, animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        {emoji}
      </div>
      <p style={{ fontSize: 17, color: 'var(--amber)', fontStyle: 'italic', marginTop: 10 }}>
        {quote}
      </p>
    </div>
  )
}
