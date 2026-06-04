import React from 'react'
import { Label, Heading, Body, Card } from '../components/ui'
import Cell from '../components/Cell'

export default function EndLucaStays() {
  return (
    <div className="flex flex-col gap-4">
      <Label>Conclusion — Path A</Label>
      <Heading>LUCA remains.</Heading>

      <div className="flex justify-center">
        <Cell size={100} index={0} label="LUCA" />
      </div>

      <Card success>
        <p className="text-[16px] leading-[1.75] text-muted">
          You chose a single cell. LUCA stands: one ancestor, all life descends from it.
          Darwin's original picture holds.
        </p>
      </Card>

      <Card>
        <p className="text-[15px] leading-[1.7] text-dim italic">
          "…probably all the organic beings which have ever lived on this earth have descended
          from some one primordial form…"
        </p>
        <p className="text-[11px] text-faint mt-2 font-mono">— Darwin, On the Origin of Species</p>
      </Card>

      <Body className="text-center">But what happens if LUCA was a population? Try the other path.</Body>
    </div>
  )
}
