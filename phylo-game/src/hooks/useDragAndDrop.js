// src/hooks/useDragAndDrop.js
import { useState, useRef, useCallback, useEffect } from 'react'

export function useDragAndDrop() {
    const [draggingId, setDraggingId] = useState(null)
    const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })
    const [ghostFile, setGhostFile] = useState(null)
    const activeDropTarget = useRef(null)
    const onDropCallback = useRef(null)

    const startDrag = useCallback((instanceId, file, clientX, clientY) => {
        setDraggingId(instanceId)
        setGhostFile(file)
        setGhostPos({ x: clientX, y: clientY })
    }, [])

    const endDrag = useCallback(() => {
        if (activeDropTarget.current !== null && onDropCallback.current) {
            onDropCallback.current(activeDropTarget.current)
        }
        setDraggingId(null)
        setGhostFile(null)
        activeDropTarget.current = null
        onDropCallback.current = null
    }, [])

    const updateGhostPos = useCallback((x, y) => {
        setGhostPos({ x, y })
    }, [])

    const registerDropTarget = useCallback((nodeId, callback) => {
        onDropCallback.current = callback
        activeDropTarget.current = nodeId
    }, [])

    const clearDropTarget = useCallback(() => {
        activeDropTarget.current = null
    }, [])

    return {
        draggingId,
        ghostPos,
        ghostFile,
        startDrag,
        endDrag,
        updateGhostPos,
        registerDropTarget,
        clearDropTarget,
    }
}