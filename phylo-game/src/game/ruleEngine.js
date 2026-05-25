// src/game/ruleEngine.js

// Fixed tree topology:
//         [0] root
//        /    \
//      [1]    [2]
//      / \      \
//    [3] [4]   [5]

// Each rule is a NARRATIVE — it describes what evolved when.
// assignFn(aliens) returns placement: { 0: alien, 1: alien, ... 5: alien }
// It picks the best-fitting alien for each node based on trait logic.
// narrative: describes the evolutionary story shown on reveal.
// steps: array of clade descriptions shown on the tree reveal.

export const RULE_POOL = [
    {
        id: 'legs_reduction',
        label: 'Limb Reduction Hypothesis',
        traitKey: 'legs',
        narrative: `The ancestral lineage had many limbs. The first major split separated those that retained high limb counts from those that began reducing them. Within the reduced-limb clade, a further reduction to minimal limbs occurred. The tentacle lineage diverged early, retaining primitive limb morphology but switching to a radically different limb type.`,
        cladeDescriptions: {
            0: 'Most primitive — highest leg count of all',
            1: 'First reduction clade — intermediate leg count',
            2: 'Early divergent — different leg type emerged',
            3: 'Further reduced — fewer legs than clade ancestor',
            4: 'Parallel reduction — convergent with sibling',
            5: 'Derived from divergent line — leg type fixed',
        },
        assignFn: (aliens) => {
            const byLegs = [...aliens].sort((a, b) =>
                (b.traits.legs?.count ?? 0) - (a.traits.legs?.count ?? 0)
            )
            const byType = [...aliens].sort((a, b) => {
                const order = ['tentacles', 'crustacean', 'humanoid', 'short', 'bird', 'snake']
                return order.indexOf(a.traits.legs?.type) - order.indexOf(b.traits.legs?.type)
            })
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            return {
                0: pick(p => p.reduce((a, b) => (a.traits.legs?.count ?? 0) > (b.traits.legs?.count ?? 0) ? a : b)),
                2: pick(p => p.reduce((a, b) => {
                    const order = ['tentacles', 'crustacean', 'humanoid', 'short']
                    return order.indexOf(a.traits.legs?.type) < order.indexOf(b.traits.legs?.type) ? a : b
                })),
                1: pick(p => p.reduce((a, b) => (a.traits.legs?.count ?? 0) > (b.traits.legs?.count ?? 0) ? a : b)),
                3: pick(p => p.reduce((a, b) => (a.traits.legs?.count ?? 0) > (b.traits.legs?.count ?? 0) ? a : b)),
                4: pick(p => p.reduce((a, b) => (a.traits.legs?.count ?? 0) < (b.traits.legs?.count ?? 0) ? a : b)),
                5: pick(p => p[0]),
            }
        },
    },

    {
        id: 'eye_evolution',
        label: 'Ocular Complexity Hypothesis',
        traitKey: 'eyes',
        narrative: `The common ancestor had a single primitive eye. The first evolutionary split produced one lineage that developed paired eyes, and another that retained the single eye but refined its structure. Within the paired-eye lineage, one branch further proliferated to 3 or 4 eyes. The single-eye branch diversified its pupil morphology — from round to lizard-slit to snake-vertical.`,
        cladeDescriptions: {
            0: 'Ancestral — single primitive eye, least refined',
            1: 'Paired eyes evolved — first major ocular innovation',
            2: 'Single eye retained but pupil type diverged',
            3: 'Eye proliferation — 3 or more eyes evolved',
            4: 'Paired eyes stabilised at 2',
            5: 'Derived pupil morphology — snake or lizard type',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            return {
                0: pick(p => p.find(a => a.traits.eyes?.count === 1 && a.traits.eyes?.type === 'humanoid')
                    ?? p.reduce((a, b) => (a.traits.eyes?.count ?? 2) < (b.traits.eyes?.count ?? 2) ? a : b)),
                2: pick(p => p.find(a => a.traits.eyes?.count === 1 && ['lizard', 'snake', 'goat'].includes(a.traits.eyes?.type))
                    ?? p.find(a => ['lizard', 'snake', 'goat'].includes(a.traits.eyes?.type))
                    ?? p.reduce((a, b) => (a.traits.eyes?.count ?? 2) < (b.traits.eyes?.count ?? 2) ? a : b)),
                1: pick(p => p.find(a => (a.traits.eyes?.count ?? 0) === 2)
                    ?? p[0]),
                3: pick(p => p.reduce((a, b) => (a.traits.eyes?.count ?? 0) > (b.traits.eyes?.count ?? 0) ? a : b)),
                4: pick(p => p.find(a => (a.traits.eyes?.count ?? 0) === 2) ?? p[0]),
                5: pick(p => p[0]),
            }
        },
    },

    {
        id: 'head_appendage_evolution',
        label: 'Cranial Appendage Radiation',
        traitKey: 'head',
        narrative: `The ancestor bore no cranial appendages. The first split separated those that developed antennae — sensory organs for detecting electromagnetic fields — from those that developed structural protrusions like horns or crests. Within the antenna lineage, some species added more antennae over time. The horn lineage diverged further into those with ear-like structures, suggesting a common sensory origin.`,
        cladeDescriptions: {
            0: 'Ancestral — no cranial appendages',
            1: 'Antenna lineage — sensory antennae first appeared',
            2: 'Horn/crest lineage — structural protrusions evolved',
            3: 'Multi-antenna — antenna count increased',
            4: 'Single antenna retained — basal of antenna clade',
            5: 'Ear-like structures — horn lineage diversified',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            const headLen = a => a.traits.head?.length ?? 0
            const hasType = (a, ...types) => types.some(t => a.traits.head?.includes(t))
            return {
                0: pick(p => p.find(a => headLen(a) === 0)
                    ?? p.reduce((a, b) => headLen(a) < headLen(b) ? a : b)),
                2: pick(p => p.find(a => hasType(a, 'horn', 'crest', 'spike'))
                    ?? p.find(a => hasType(a, 'bunny_ear', 'dog_ear', 'ear'))
                    ?? p[0]),
                1: pick(p => p.find(a => hasType(a, 'antenna') && headLen(a) <= 2)
                    ?? p.find(a => hasType(a, 'antenna'))
                    ?? p[0]),
                3: pick(p => p.reduce((a, b) => headLen(a) > headLen(b) ? a : b)),
                4: pick(p => p.find(a => hasType(a, 'antenna')) ?? p[0]),
                5: pick(p => p.find(a => hasType(a, 'bunny_ear', 'dog_ear', 'ear', 'feather'))
                    ?? p[0]),
            }
        },
    },

    {
        id: 'mouth_complexity',
        label: 'Dentition Complexity Theory',
        traitKey: 'mouth',
        narrative: `The ancestral form had no teeth at all — a toothless filter-feeder. The first evolutionary split produced a lineage that developed simple teeth for grinding, while a separate lineage developed fangs for predation. Within the toothed lineage, one branch eventually lost teeth again in a secondary reduction — a common reversal in evolution. The fang lineage diversified into beak-bearing species, suggesting fangs and beaks share a keratin-based developmental pathway.`,
        cladeDescriptions: {
            0: 'Ancestral — toothless, likely a filter feeder',
            1: 'Toothed lineage — teeth evolved for grinding',
            2: 'Fang lineage — predatory dentition emerged',
            3: 'Secondary tooth loss — reverted to toothless',
            4: 'Teeth retained and elaborated',
            5: 'Beak evolved from fang ancestry',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            const mouthOrder = { toothless: 0, teeth: 1, fang: 2, beak: 3 }
            const mouthVal = a => mouthOrder[a.traits.mouth] ?? 0
            return {
                0: pick(p => p.find(a => a.traits.mouth === 'toothless')
                    ?? p.reduce((a, b) => mouthVal(a) < mouthVal(b) ? a : b)),
                2: pick(p => p.find(a => a.traits.mouth === 'fang')
                    ?? p.reduce((a, b) => mouthVal(a) > mouthVal(b) ? a : b)),
                1: pick(p => p.find(a => a.traits.mouth === 'teeth') ?? p[0]),
                3: pick(p => p.find(a => a.traits.mouth === 'toothless') ?? p[0]),
                4: pick(p => p.find(a => a.traits.mouth === 'teeth') ?? p[0]),
                5: pick(p => p.find(a => a.traits.mouth === 'beak')
                    ?? p.find(a => a.traits.mouth === 'fang')
                    ?? p[0]),
            }
        },
    },

    {
        id: 'body_shape_evolution',
        label: 'Body Plan Diversification',
        traitKey: 'body',
        narrative: `The ancestral body plan was round — a simple, energy-efficient shape with no directional growth bias. The first major cladogenic event split round-bodied forms from those that began elongating or angulating their body wall. Square bodies represent a derived condition with rigid exoskeletal support, while triangular bodies reflect a further specialisation toward directional locomotion. The round lineage itself diversified significantly through other traits.`,
        cladeDescriptions: {
            0: 'Ancestral round body — primitive undifferentiated form',
            1: 'Round body retained — diversified through other traits',
            2: 'Angulated body plan — first body wall specialisation',
            3: 'Round but highly derived — secondary specialisations',
            4: 'Round with convergent features',
            5: 'Square or triangular — most derived body plan',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            const bodyOrder = { round: 0, circle: 0, blob: 1, square: 2, triangle: 3 }
            const bodyVal = a => bodyOrder[a.traits.body] ?? 0
            return {
                0: pick(p => p.reduce((a, b) => bodyVal(a) < bodyVal(b) ? a : b)),
                2: pick(p => p.find(a => ['square', 'triangle'].includes(a.traits.body))
                    ?? p.reduce((a, b) => bodyVal(a) > bodyVal(b) ? a : b)),
                1: pick(p => p.find(a => ['round', 'circle', 'blob'].includes(a.traits.body)) ?? p[0]),
                3: pick(p => p.find(a => ['round', 'circle', 'blob'].includes(a.traits.body)) ?? p[0]),
                4: pick(p => p.find(a => ['round', 'circle', 'blob'].includes(a.traits.body)) ?? p[0]),
                5: pick(p => p.find(a => ['square', 'triangle'].includes(a.traits.body)) ?? p[0]),
            }
        },
    },

    {
        id: 'color_pigmentation',
        label: 'Pigmentation Divergence Hypothesis',
        traitKey: 'color',
        narrative: `Ancestral pigmentation was neutral — a dull protective coloration. Cool pigments (blues and purples) evolved first as camouflage in low-light environments. Warm pigments (oranges, yellows, reds) evolved independently in a separate lineage adapted to bright, open habitats. Within the cool lineage, intense purples arose as a secondary sexual signal. Pink coloration represents a derived hybrid pigmentation pathway combining both warm and cool precursors.`,
        cladeDescriptions: {
            0: 'Ancestral — neutral or dull coloration',
            1: 'Cool pigment lineage — blues and greens',
            2: 'Warm pigment lineage — oranges and yellows',
            3: 'Intense cool — purples and deep blues evolved',
            4: 'Cool pigment stabilised at blue-green',
            5: 'Bright warm derived — reds or intense oranges',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            const cool = ['blue', 'teal', 'green', 'lime', 'sky', 'mint']
            const warm = ['orange', 'yellow', 'red', 'coral', 'gold']
            const intense = ['purple', 'lavender']
            const neutral = ['grey', 'white', 'brown']
            const isCool = a => cool.includes(a.traits.color)
            const isWarm = a => warm.includes(a.traits.color)
            const isIntense = a => intense.includes(a.traits.color)
            return {
                0: pick(p => p.find(a => neutral.includes(a.traits.color))
                    ?? p.find(a => a.traits.color === 'green')
                    ?? p[0]),
                2: pick(p => p.find(a => isWarm(a)) ?? p[0]),
                1: pick(p => p.find(a => isCool(a)) ?? p[0]),
                3: pick(p => p.find(a => isIntense(a)) ?? p.find(a => a.traits.color === 'purple') ?? p[0]),
                4: pick(p => p.find(a => isCool(a)) ?? p[0]),
                5: pick(p => p.find(a => isWarm(a) || a.traits.color === 'pink') ?? p[0]),
            }
        },
    },

    {
        id: 'leg_type_transition',
        label: 'Locomotion Type Transition',
        traitKey: 'legs',
        narrative: `The ancestor moved on many jointed humanoid limbs. Two major locomotion strategies diverged: one lineage retained jointed limbs but reduced their number for speed, while another transitioned to tentacular locomotion — a radical reimagining of movement. Within the tentacle lineage, some species re-evolved rigid leg-like structures from tentacle bases, a process called secondary sclerotisation. The humanoid lineage shows a clear trend of limb number reduction over evolutionary time.`,
        cladeDescriptions: {
            0: 'Ancestral — many humanoid legs, most primitive',
            1: 'Humanoid limb reduction — fewer legs retained',
            2: 'Tentacle lineage — radical locomotion shift',
            3: 'Minimal humanoid legs — most reduced',
            4: 'Intermediate humanoid — 2-4 legs',
            5: 'Secondary rigid structures from tentacle ancestors',
        },
        assignFn: (aliens) => {
            const pool = [...aliens]
            const pick = (fn) => {
                const found = fn(pool)
                if (!found) return pool.splice(0, 1)[0]
                pool.splice(pool.indexOf(found), 1)
                return found
            }
            const isTentacle = a => a.traits.legs?.type === 'tentacles'
            const legCount = a => a.traits.legs?.count ?? 0
            return {
                0: pick(p => p.filter(a => !isTentacle(a))
                    .reduce((a, b) => legCount(a) > legCount(b) ? a : b, p[0])),
                2: pick(p => p.find(a => isTentacle(a)) ?? p[0]),
                1: pick(p => p.filter(a => !isTentacle(a))
                    .reduce((a, b) => legCount(a) > legCount(b) ? a : b, p[0])),
                3: pick(p => p.filter(a => !isTentacle(a))
                    .reduce((a, b) => legCount(a) < legCount(b) ? a : b, p[0])),
                4: pick(p => p[0]),
                5: pick(p => p[0]),
            }
        },
    },
]

export function pickSessionRule() {
    return RULE_POOL[Math.floor(Math.random() * RULE_POOL.length)]
}

export function buildCorrectTree(aliens, rule) {
    // assignFn returns { nodeId: alien }
    // convert to array indexed by nodeId
    const assignment = rule.assignFn(aliens)
    const tree = []
    for (let i = 0; i < 6; i++) {
        tree[i] = assignment[i] ?? null
    }
    return tree
}

export function scoreRound(playerPlacement, correctTree) {
    const nodeResults = {}
    let score = 0
    for (let nodeId = 0; nodeId < 6; nodeId++) {
        const correctAlien = correctTree[nodeId]
        const placedInstanceId = playerPlacement[nodeId]
        const correct = !!correctAlien &&
            !!placedInstanceId &&
            correctAlien.instanceId === placedInstanceId
        nodeResults[nodeId] = correct
        if (correct) score++
    }
    return { score, nodeResults }
}