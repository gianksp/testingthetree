// src/hooks/useGameSession.js
import { useState, useCallback, useEffect } from 'react'
import { pickSessionRule, buildCorrectTree, scoreRound } from '../game/ruleEngine'
import { generateRoundAliens } from '../game/alienData'

export const PHASE = {
    PLACING: 'placing',
    REVEAL: 'reveal',
}

// placement: { 0: instanceId|null, 1: instanceId|null, ... 5: instanceId|null }
function emptyPlacement() {
    return { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null }
}

export function useGameSession(roster) {
    const [rule, setRule] = useState(null)
    const [aliens, setAliens] = useState([])
    const [placement, setPlacement] = useState(emptyPlacement)
    const [phase, setPhase] = useState(PHASE.PLACING)
    const [result, setResult] = useState(null)

    // Init once roster is ready
    useEffect(() => {
        if (!roster?.length || roster.length < 6) return
        const newRule = pickSessionRule()
        const newAliens = generateRoundAliens(roster, newRule.traitKey)
        setRule(newRule)
        setAliens(newAliens)
        setPlacement(emptyPlacement())
    }, [roster])

    const placedInstanceIds = Object.values(placement).filter(Boolean)
    const trayAliens = aliens.filter(a => !placedInstanceIds.includes(a.instanceId))
    const isComplete = placedInstanceIds.length === 6

    // Drop alien onto a node
    const dropOnNode = useCallback((nodeId, instanceId) => {
        if (!instanceId) return
        setPlacement(prev => {
            const next = { ...prev }

            // If alien is already placed somewhere, clear that spot
            for (const [nid, iid] of Object.entries(next)) {
                if (iid === instanceId) {
                    next[nid] = null
                }
            }

            // If target node already has an alien, send it back to tray
            // (just null it — trayAliens recomputes)
            next[nodeId] = instanceId
            return next
        })
    }, [])

    // Remove alien from a node back to tray
    const removeFromNode = useCallback((nodeId) => {
        setPlacement(prev => ({ ...prev, [nodeId]: null }))
    }, [])

    const submit = useCallback(() => {
        if (!isComplete || !rule) return
        const correctTree = buildCorrectTree(aliens, rule)
        const { score, nodeResults } = scoreRound(placement, correctTree)
        setResult({ score, nodeResults, correctTree })
        setPhase(PHASE.REVEAL)
    }, [placement, aliens, rule, isComplete])

    const nextRound = useCallback(() => {
        if (!roster?.length) return
        const newRule = pickSessionRule()
        const newAliens = generateRoundAliens(roster, newRule.traitKey)
        setRule(newRule)
        setAliens(newAliens)
        setPlacement(emptyPlacement())
        setPhase(PHASE.PLACING)
        setResult(null)
    }, [roster])

    return {
        rule,
        aliens,
        placement,
        phase,
        result,
        trayAliens,
        isComplete,
        dropOnNode,
        removeFromNode,
        nextRound,
        submit,
    }
}