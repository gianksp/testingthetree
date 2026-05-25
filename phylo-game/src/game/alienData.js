// src/game/alienData.js

const BASE = import.meta.env.BASE_URL

export const ALIENS_BASE_URL = `${BASE}aliens/`
export const MANIFEST_URL = `${BASE}aliens/manifest.json`

export async function loadManifest() {
    const res = await fetch(MANIFEST_URL)

    if (!res.ok) {
        throw new Error(`Failed to load manifest: ${res.status} from ${MANIFEST_URL}`)
    }

    const json = await res.json()

    if (!Array.isArray(json.aliens)) {
        throw new Error('manifest.json must have an "aliens" array')
    }

    return json.aliens.filter(a => {
        const ok = a.id && a.file && a.name && a.traits
        if (!ok) console.warn('Skipping invalid alien entry:', a)
        return ok
    })
}

// Extract a comparable scalar from any trait shape
function getTraitValue(alien, traitKey) {
    const t = alien.traits[traitKey]
    if (t === undefined || t === null) return null
    if (Array.isArray(t)) return t.length
    if (typeof t === 'object') return t.type ?? t.count ?? null
    return t
}

export function generateRoundAliens(roster, traitKey) {
    if (!roster?.length || roster.length < 6) {
        throw new Error(`Need at least 6 aliens in manifest, found ${roster?.length ?? 0}`)
    }

    const max = 50
    let attempts = 0

    while (attempts < max) {
        const shuffled = [...roster].sort(() => Math.random() - 0.5)
        const candidates = shuffled.slice(0, 6)
        const distinct = new Set(candidates.map(a => getTraitValue(a, traitKey)))

        if (distinct.size >= 2) {
            return candidates.map((a, i) => ({
                ...a,
                instanceId: `${a.id}_${i}_${Date.now()}`,
            }))
        }
        attempts++
    }

    // Fallback — just return 6 random aliens
    const shuffled = [...roster].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6).map((a, i) => ({
        ...a,
        instanceId: `${a.id}_${i}_${Date.now()}`,
    }))
}