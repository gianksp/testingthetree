import React from 'react'
import { Label, Heading, Body, Card } from '../components/ui'
import Cell from '../components/Cell'

const CELL_POSITIONS = [
  { x: 110, y: 10 }, { x: 52, y: 30 }, { x: 168, y: 45 },
  { x: 80, y: 88 },  { x: 148, y: 95 }, { x: 112, y: 60 },
]
const SCATTER = [
  { x: -60, y: -40 }, { x: -80, y: 20 }, { x: 60, y: -50 },
  { x: -50, y: 50 },  { x: 70, y: 40 },  { x: 0, y: 0 },
]

export default function Q2Screen({ q2Choice, onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      <Label>Question 2</Label>
      <Heading>Did that population share one common ancestor?</Heading>
      <Body>
        You said LUCA was a <em className="text-amber italic">population</em>.
        Did all these cells descend from one original cell?
      </Body>

      <div className="relative h-[180px]">
        {CELL_POSITIONS.map((pos, i) => {
          const isAncestor = i === 5
          const highlighted = q2Choice === 'yes' && isAncestor
          const faded = q2Choice === 'yes' && !isAncestor
          const tx = q2Choice === 'no' ? SCATTER[i].x : 0
          const ty = q2Choice === 'no' ? SCATTER[i].y : 0
          return (
            <div key={i} className="absolute" style={{
              left: pos.x, top: pos.y,
              transform: `translate(${tx}px, ${ty}px)`,
              transition: 'transform 0.5s cubic-bezier(0.34,1.3,0.64,1), opacity 0.4s',
              opacity: faded ? 0.15 : 1,
              zIndex: highlighted ? 2 : 1,
              animation: `fadeUp 0.4s ${i * 80}ms ease both`,
            }}>
              <Cell size={isAncestor ? 68 : 52} index={i} selected={highlighted} />
            </div>
          )
        })}
        {q2Choice === 'yes' && (
          <div className="fade-up absolute font-mono text-[11px] text-amber text-center w-20" style={{ left: 92, top: 138 }}>
            = LUCA
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {[
          { key: 'yes', title: 'Yes — one common ancestor', sub: 'The whole population traces back to one original cell' },
          { key: 'no',  title: 'No — multiple independent starts', sub: 'The cells in this population arose separately' },
        ].map(opt => (
          <button key={opt.key} onClick={() => onSelect(opt.key)}
            className={`w-full text-left rounded-xl px-4 py-3.5 border-[1.5px] cursor-pointer transition-all
              ${q2Choice === opt.key ? 'bg-amber-soft border-amber' : 'bg-bg-card border-border'}`}>
            <div className="font-semibold text-[16px] text-text mb-0.5">{opt.title}</div>
            <div className="text-[13px] text-muted">{opt.sub}</div>
          </button>
        ))}
      </div>

      {q2Choice === 'yes' && (
        <Card danger className="fade-up">
          <p className="text-[15px] leading-relaxed text-muted">
            Then <em>that single cell</em> is LUCA. You've just pushed LUCA back one step — it reappears.
          </p>
        </Card>
      )}
      {q2Choice === 'no' && (
        <Card accent className="fade-up">
          <p className="text-[15px] leading-relaxed text-muted">
            So each cell arose independently. Now the question is: how many?
          </p>
        </Card>
      )}
    </div>
  )
}
