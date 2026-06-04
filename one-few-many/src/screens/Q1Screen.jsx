import React from 'react'
import { Label, Heading, Body, Card } from '../components/ui'
import Cell from '../components/Cell'

export default function Q1Screen({ q1Choice, onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      <Label>Question 1</Label>
      <Heading>Was LUCA a single cell — or a population?</Heading>
      <Body>LUCA is the origin point of all life. But what form did it take? Tap to choose.</Body>

      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onSelect('single')}
          className={`flex flex-col items-center gap-3 rounded-xl p-4 cursor-pointer border-[1.5px] transition-all
            ${q1Choice === 'single' ? 'bg-amber-soft border-amber' : 'bg-bg-card border-border'}`}
        >
          <Cell size={72} index={0} selected={q1Choice === 'single'} />
          <div className="text-center">
            <div className="font-semibold text-[16px] text-text mb-1">Single cell</div>
            <div className="text-[13px] text-muted leading-snug">Darwin's "one primordial form"</div>
          </div>
        </div>

        <div
          onClick={() => onSelect('population')}
          className={`flex flex-col items-center gap-3 rounded-xl p-4 cursor-pointer border-[1.5px] transition-all
            ${q1Choice === 'population' ? 'bg-amber-soft border-amber' : 'bg-bg-card border-border'}`}
        >
          <div className="relative w-[90px] h-[90px]">
            {[{ x: 18, y: 0 }, { x: 52, y: 8 }, { x: 4, y: 44 }, { x: 46, y: 46 }].map((pos, i) => (
              <div key={i} className="absolute" style={{ left: pos.x, top: pos.y, animation: `fadeUp 0.3s ${i * 70}ms ease both` }}>
                <Cell size={42} index={i + 3} selected={q1Choice === 'population'} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="font-semibold text-[16px] text-text mb-1">Population</div>
            <div className="text-[13px] text-muted leading-snug">A group of early organisms</div>
          </div>
        </div>
      </div>

      {q1Choice === 'single' && (
        <Card success className="fade-up">
          <p className="text-sm leading-relaxed text-muted">
            Classic answer. One ancestor, one lineage. Darwin nods approvingly.
          </p>
        </Card>
      )}
      {q1Choice === 'population' && (
        <Card accent className="fade-up">
          <p className="text-sm leading-relaxed text-muted">
            Interesting. Modern biology often favours this: populations evolve,
            not individuals. But now a question arises…
          </p>
        </Card>
      )}
    </div>
  )
}
