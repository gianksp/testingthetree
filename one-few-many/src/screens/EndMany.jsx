import React, { useMemo } from 'react'
import { Label, Heading, Card } from '../components/ui'
import Cell from '../components/Cell'

export default function EndMany({ n }) {
  const actualCount = Math.pow(10, n)
  const visibleCount = Math.min(actualCount, 35)
  const overflow = actualCount > 35
  const cellSize = n <= 1 ? 70 : n <= 2 ? 50 : n <= 3 ? 36 : 26
  const containerH = n <= 1 ? 140 : n <= 3 ? 200 : 240

  const positions = useMemo(() => {
    const goldenAngle = 2.399963
    return Array.from({ length: visibleCount }, (_, i) => {
      const r = Math.sqrt(i / Math.max(visibleCount, 1)) * 120
      const theta = i * goldenAngle
      return { x: r * Math.cos(theta), y: r * Math.sin(theta) * 0.6 }
    })
  }, [visibleCount])

  return (
    <div className="flex flex-col gap-4">
      <Label>Conclusion — Path C</Label>
      <Heading>LUCA is gone.</Heading>

      <div className="relative flex items-center justify-center" style={{ height: containerH }}>
        <div className="relative" style={{ width: 300, height: containerH }}>
          {positions.map((pos, i) => (
            <div key={`${n}-${i}`} className="absolute" style={{
              left: 150 + pos.x - cellSize / 2,
              top: containerH / 2 + pos.y - cellSize / 2,
              animation: `fadeUp 0.35s ${(i % 20) * 35}ms ease both`,
            }}>
              <Cell size={cellSize} index={i} />
            </div>
          ))}
          {overflow && (
            <div className="absolute bottom-0 left-0 right-0 text-center font-mono text-[12px] text-dim pt-12"
              style={{ background: 'linear-gradient(transparent, white 70%)' }}>
              … and {(actualCount - visibleCount).toLocaleString()} more
            </div>
          )}
        </div>
      </div>

      <Card accent>
        <div className="font-mono text-[20px] text-amber text-center mb-2">
          Orₚ × 10<sup className="text-sm">{n}</sup> = {actualCount.toLocaleString()} origins
        </div>
        <p className="text-[15px] leading-[1.7] text-muted">
          Population, no single ancestor. LUCA disappears — replaced by this many independent starting points.
        </p>
      </Card>

      <div className="pl-4 border-l-2 border-border">
        <p className="text-[15px] leading-[1.75] text-dim italic">
          Turning LUCA into a population forces a choice: find a new single ancestor
          (LUCA reappears) or accept Orₚ × 10<sup>{n}</sup> independent origins.
          There is no comfortable middle.
        </p>
      </div>
    </div>
  )
}
