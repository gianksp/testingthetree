import React from 'react'
import Cell from './Cell'

/**
 * Renders N cells in a natural-feeling cluster layout.
 * Positions are deterministic per index so they don't jump on re-render.
 */
function clusterPositions(n, spread = 1) {
  if (n === 1) return [{ x: 0, y: 0 }]

  const positions = []
  // First cell at center
  positions.push({ x: 0, y: 0 })

  // Place remaining in expanding rings
  const ringRadii = [90, 160, 210]
  let placed = 1
  for (let ring = 0; ring < ringRadii.length && placed < n; ring++) {
    const r = ringRadii[ring] * spread
    const spotsInRing = ring === 0 ? 6 : ring === 1 ? 10 : 14
    for (let i = 0; i < spotsInRing && placed < n; i++) {
      const angle = (2 * Math.PI * i) / spotsInRing + ring * 0.4
      positions.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r * 0.55, // flatten vertically
      })
      placed++
    }
  }
  return positions
}

export default function CellCluster({
  count = 1,
  cellSize = 72,
  spread = 1,
  onCellClick,
  selectedIndex = null,
  fadedAfter = null,       // fade cells with index >= fadedAfter
  containerHeight = 280,
}) {
  const positions = clusterPositions(count, spread)

  // bounding box so container doesn't overflow
  const xs = positions.map(p => p.x)
  const ys = positions.map(p => p.y)
  const minX = Math.min(...xs) - cellSize / 2
  const maxX = Math.max(...xs) + cellSize / 2
  const minY = Math.min(...ys) - cellSize / 2
  const maxY = Math.max(...ys) + cellSize / 2
  const w = maxX - minX
  const h = Math.max(maxY - minY, cellSize)

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: containerHeight,
      overflow: 'visible',
    }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: w,
        height: h,
      }}>
        {positions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x - minX - cellSize / 2,
              top:  pos.y - minY - cellSize / 2,
              width: cellSize,
              height: cellSize,
              animation: `fadeUp 0.4s ${i * 80}ms ease both`,
            }}
          >
            <Cell
              size={cellSize}
              index={i}
              selected={selectedIndex === i}
              faded={fadedAfter !== null && i >= fadedAfter}
              onClick={onCellClick ? () => onCellClick(i) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
