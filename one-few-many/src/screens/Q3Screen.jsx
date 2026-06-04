import React, { useMemo } from 'react'
import { Label, Heading, Body, Card } from '../components/ui'
import Cell from '../components/Cell'

const MAX_VISIBLE = 40

function useCellLayout(count) {
  return useMemo(() => {
    const goldenAngle = 2.399963
    return Array.from({ length: count }, (_, i) => {
      const r = Math.sqrt(i / count) * 130
      const theta = i * goldenAngle
      return { x: r * Math.cos(theta), y: r * Math.sin(theta) * 0.65 }
    })
  }, [count])
}

export default function Q3Screen({ n, onSetN }) {
  const actualCount = Math.pow(10, n)
  const visibleCount = Math.min(actualCount, MAX_VISIBLE)
  const positions = useCellLayout(visibleCount)
  const overflow = actualCount > MAX_VISIBLE
  const cellSize = n <= 1 ? 72 : n <= 2 ? 52 : n <= 3 ? 38 : 28
  const containerH = Math.min(80 + visibleCount * 6, 260)

  return (
    <div className="flex flex-col gap-4">
      <Label>Question 3</Label>
      <Heading>How many independent origins?</Heading>
      <Body>
        Each cell arose separately. The total is{' '}
        <em className="text-amber italic">Orₚ × 10<sup>{n}</sup></em>. Drag to set the exponent.
      </Body>

      <Card>
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[13px] text-faint font-mono">exponent n =</span>
          <span className="text-[30px] font-semibold font-mono text-amber">{n}</span>
        </div>
        <input type="range" min="0" max="7" step="1" value={n}
          onChange={e => onSetN(parseInt(e.target.value))} className="mb-2" />
        <div className="flex justify-between">
          <span className="text-[11px] text-dim font-mono">Orₚ × 1</span>
          <span className="text-[11px] text-dim font-mono">Orₚ × 10⁷</span>
        </div>
      </Card>

      <div className="relative flex items-center justify-center" style={{ height: containerH }}>
        <div className="relative" style={{ width: 300, height: containerH }}>
          {positions.map((pos, i) => (
            <div key={`${n}-${i}`} className="absolute" style={{
              left: 150 + pos.x - cellSize / 2,
              top: containerH / 2 + pos.y - cellSize / 2,
              animation: `fadeUp 0.3s ${(i % 20) * 30}ms ease both`,
            }}>
              <Cell size={cellSize} index={i} />
            </div>
          ))}
          {overflow && (
            <div className="absolute bottom-0 left-0 right-0 text-center font-mono text-[13px] text-dim pt-10"
              style={{ background: 'linear-gradient(transparent, white 60%)' }}>
              … and {(actualCount - MAX_VISIBLE).toLocaleString()} more
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
