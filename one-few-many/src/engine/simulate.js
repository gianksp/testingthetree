export const DOT_COLORS = [
  { border: '#c8a84b', bg: '#c8a84b22' },
  { border: '#5a8fc8', bg: '#5a8fc822' },
  { border: '#8fc85a', bg: '#8fc85a22' },
  { border: '#c85a8f', bg: '#c85a8f22' },
  { border: '#8f5ac8', bg: '#8f5ac822' },
  { border: '#5ac8c8', bg: '#5ac8c822' },
  { border: '#c8705a', bg: '#c8705a22' },
  { border: '#a8c85a', bg: '#a8c85a22' },
]

export const TIME_STEPS = [
  { label: 'Origin',  killRate: 0 },
  { label: '500 Myr', killRate: null },
  { label: '1 Byr',   killRate: null },
  { label: '2 Byr',   killRate: null },
  { label: '4 Byr',   killRate: null },
]

/**
 * Run a world simulation given player params.
 * Returns { origins, snapshots, final }
 */
export function simulate({ abioDifficulty, extinctionRate, competitionIntensity }) {
  const baseOrigins = Math.max(
    1,
    Math.round((1 - abioDifficulty) * 40 * (0.4 + Math.random() * 0.8))
  )

  let pool = Array.from({ length: baseOrigins }, (_, i) => ({
    id: i,
    color: DOT_COLORS[i % DOT_COLORS.length],
    strength: 0.3 + Math.random() * 0.7,
  }))

  const snapshots = [{ label: 'Origin', dots: [...pool] }]

  const steps = [
    { label: '500 Myr', base: extinctionRate * 0.45 + competitionIntensity * 0.20 },
    { label: '1 Byr',   base: extinctionRate * 0.38 + competitionIntensity * 0.16 },
    { label: '2 Byr',   base: extinctionRate * 0.30 + competitionIntensity * 0.12 },
    { label: '4 Byr',   base: extinctionRate * 0.22 + competitionIntensity * 0.08 },
  ]

  for (const step of steps) {
    pool = pool.filter(d => Math.random() > step.base + (1 - d.strength) * 0.18)
    // always leave at least one survivor
    if (pool.length === 0) {
      const fallback = Math.floor(Math.random() * baseOrigins)
      pool = [{ id: fallback, color: DOT_COLORS[fallback % DOT_COLORS.length], strength: 0.9 }]
    }
    snapshots.push({ label: step.label, dots: [...pool] })
  }

  return { origins: baseOrigins, snapshots, final: pool.length }
}

/** Map origin count to a bucket index 0-3 */
export function classifyOrigins(n) {
  if (n === 1)   return 0
  if (n <= 10)   return 1
  if (n <= 100)  return 2
  return 3
}

export const GUESS_LABELS = ['1 origin', '2–10 origins', '10–100 origins', '100+ origins']
