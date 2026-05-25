// src/hooks/useManifest.js
import { useState, useEffect } from 'react'
import { loadManifest } from '../game/alienData'

export function useManifest() {
    const [roster, setRoster] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadManifest()
            .then(aliens => {
                setRoster(aliens)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return { roster, loading, error }
}