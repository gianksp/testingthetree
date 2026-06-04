import React from 'react'
import { Screen, Label, Heading, Body, BtnPrimary, Card } from '../components/ui'
import Cell from '../components/Cell'

export default function IntroScreen({ onStart }) {
  return (
      <div className="flex-1 flex flex-col justify-center">
        {/* <div className="flex justify-center mb-4">
          <Cell size={110} index={0} />
        </div> */}

        <Label className="text-center">An interactive argument</Label>
        <Heading className="text-center text-[32px] mb-4">One, Few, or Many?</Heading>
        <Body className="text-center mb-7 text-md">
          Was LUCA (the Last Universal Common Ancestor)a single cell, or a population?
          Follow the logic and see where it leads.
        </Body>

        <Card className="mb-2">
          <p className="text-sm leading-[1.75] text-muted">
            Darwin wrote of <em>"one primordial form"</em>—a single ancestor for all life.
            But what if LUCA was actually a <em>population</em>?
            That small change has a surprising consequence.
          </p>
        </Card>
      </div>

  )
}
