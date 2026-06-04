import React from 'react'
import Dot from './Dot'

export default function DotField({ dots, grey = false, size = 14 }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', minHeight: 28 }}>
      {dots.map((d, i) => (
        <Dot key={d.id ?? i} color={d.color} delay={i * 55} grey={grey} size={size} />
      ))}
    </div>
  )
}
