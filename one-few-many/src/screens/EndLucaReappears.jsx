import React, { useState, useEffect } from 'react'
import { Label, Heading, Body, Card } from '../components/ui'
import Cell from '../components/Cell'

const CLUSTER_POS = [
  { x: -70, y: -30 }, { x: 70, y: -40 }, { x: -80, y: 30 },
  { x: 65, y: 35 },   { x: 0, y: -65 },  { x: 10, y: 50 },
]

export default function EndLucaReappears() {
  const [phase, setPhase] = useState('cluster')

  useEffect(() => {
    let cancelled = false
    const run = () => {
      const t1 = setTimeout(() => !cancelled && setPhase('converging'), 1200)
      const t2 = setTimeout(() => !cancelled && setPhase('luca'), 2400)
      const t3 = setTimeout(() => { if (!cancelled) { setPhase('cluster'); run() } }, 3800)
      return () => { cancelled = true; [t1, t2, t3].forEach(clearTimeout) }
    }
    return run()
  }, [])

  const converged = phase === 'converging' || phase === 'luca'

  return (
    <div className="flex flex-col gap-4">
      <Label>Conclusion — Path B</Label>
      <Heading>LUCA reappears.</Heading>
      <Body>
        You said population — but that population had one common ancestor.
        That ancestor <em>is</em> LUCA. Watch the loop.
      </Body>

      <div className="relative h-[200px] flex items-center justify-center">
        {CLUSTER_POS.map((pos, i) => (
          <div key={i} className="absolute" style={{
            transform: `translate(${converged ? 0 : pos.x}px, ${converged ? 0 : pos.y}px)`,
            transition: 'transform 0.9s cubic-bezier(0.34,1.1,0.64,1)',
            opacity: phase === 'luca' && i > 0 ? 0 : 1,
            zIndex: i === 0 ? 2 : 1,
          }}>
            <Cell size={phase === 'luca' && i === 0 ? 80 : 46} index={i} selected={phase === 'luca' && i === 0} />
          </div>
        ))}
        {phase === 'luca' && (
          <div className="fade-up absolute bottom-4 font-mono text-[13px] text-amber text-center">
            = LUCA (again)
          </div>
        )}
      </div>

      <Card danger>
        <p className="text-[16px] leading-[1.75] text-muted">
          Population → one ancestor → that ancestor <em>is</em> LUCA.
          You've pushed the question back one step — not answered it.
        </p>
      </Card>

      <Card>
        <div className="flex flex-col gap-2.5">
          {['LUCA = population', 'population has one ancestor', 'that ancestor = LUCA', '→ back to start'].map((step, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-6 h-6 rounded-full bg-amber-soft border border-amber/30 flex items-center justify-center text-[11px] font-mono text-amber shrink-0">
                {i + 1}
              </div>
              <span className={`text-[15px] ${i === 3 ? 'text-amber font-semibold' : 'text-muted'}`}>{step}</span>
            </div>
          ))}
        </div>
      </Card>

      <Body className="text-center">
        The only escape is to say the population had <em>no</em> single ancestor. Try that path.
      </Body>
    </div>
  )
}
