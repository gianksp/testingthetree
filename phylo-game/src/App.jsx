// src/App.jsx
import { useState, useCallback, useEffect, useRef } from 'react'
import { useGameSession, PHASE } from './hooks/useGameSession'
import { useManifest } from './hooks/useManifest'
import PhyloTree from './components/PhyloTree'
import AlienTray from './components/AlienTray'
import RevealOverlay from './components/RevealOverlay'
import HowToPlay from './components/HowToPlay'
import DragGhost from './components/DragGhost'

export default function App() {
  const { roster, loading, error } = useManifest()
  const [showHow, setShowHow] = useState(true)

  const [draggingId, setDraggingId] = useState(null)
  const [draggingFile, setDraggingFile] = useState(null)
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })
  const [overNode, setOverNode] = useState(null)

  const draggingIdRef = useRef(null)
  const overNodeRef = useRef(null)

  const {
    rule, aliens, placement, phase, result,
    trayAliens, isComplete,
    dropOnNode, removeFromNode,
    nextRound, submit,
  } = useGameSession(roster)

  // Find which node (if any) is under the pointer using data attribute
  const getNodeUnderPointer = useCallback((clientX, clientY) => {
    const els = document.elementsFromPoint(clientX, clientY)
    for (const el of els) {
      const nodeId = el.dataset?.nodeId
      if (nodeId !== undefined) return parseInt(nodeId)
    }
    return null
  }, [])

  const handlePointerDown = useCallback((e, alien) => {
    e.preventDefault()
    draggingIdRef.current = alien.instanceId
    setDraggingId(alien.instanceId)
    setDraggingFile(alien.file)
    setGhostPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!draggingIdRef.current) return
    setGhostPos({ x: e.clientX, y: e.clientY })
    const nodeId = getNodeUnderPointer(e.clientX, e.clientY)
    if (nodeId !== overNodeRef.current) {
      overNodeRef.current = nodeId
      setOverNode(nodeId)
    }
  }, [getNodeUnderPointer])

  const handlePointerUp = useCallback((e) => {
    if (!draggingIdRef.current) return
    const nodeId = getNodeUnderPointer(e.clientX, e.clientY)
    if (nodeId !== null) {
      dropOnNode(nodeId, draggingIdRef.current)
    }
    draggingIdRef.current = null
    overNodeRef.current = null
    setDraggingId(null)
    setDraggingFile(null)
    setOverNode(null)
  }, [getNodeUnderPointer, dropOnNode])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="text-4xl mb-3">🧬</div>
        <p className="text-sm text-slate-500">Loading specimens…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 px-6">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-sm text-slate-300 font-semibold">Failed to load manifest</p>
        <p className="text-xs text-slate-600 mt-1 font-mono">{error}</p>
      </div>
    </div>
  )

  if (roster.length < 6) return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 px-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🔬</div>
        <p className="text-sm text-slate-300 font-semibold">Not enough specimens</p>
        <p className="text-xs text-slate-500 mt-1">Add at least 6 aliens to manifest.json</p>
      </div>
    </div>
  )

  if (showHow) return <HowToPlay onStart={() => setShowHow(false)} />

  if (!rule) return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
      <p className="text-sm text-slate-500">Preparing round…</p>
    </div>
  )

  const remaining = 6 - Object.values(placement).filter(Boolean).length

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 overflow-hidden">

      <DragGhost file={draggingFile} x={ghostPos.x} y={ghostPos.y} />

      {/* header */}
      <header className="shrink-0 px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1
              className="text-xl md:text-2xl font-black tracking-widest text-white"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Phylo<span className="text-cyan-400">Quest</span>
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider hidden sm:block">
              Place each specimen on its correct ancestor node
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${i < (6 - remaining) ? 'bg-cyan-400' : 'bg-slate-700'}
                `} />
              ))}
            </div>
            <div className="flex items-center gap-1.5 bg-violet-950 border border-violet-800 rounded-full px-3 py-1.5">
              <span className="text-[9px] font-bold text-violet-400 tracking-widest uppercase">Hint</span>
              <span className="text-xs font-bold text-violet-200 font-mono">{rule.traitKey}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE */}
      <div className="flex-1 overflow-hidden flex flex-col lg:hidden min-h-0">
        <main className="overflow-y-auto bg-white" style={{ flex: '0 0 60%' }}>
          <PhyloTree
            aliens={aliens}
            placement={placement}
            draggingId={draggingId}
            overNode={overNode}
            onRemoveFromNode={removeFromNode}
            nodeResults={null}
            correctTree={null}
          />
        </main>
        <div className="shrink-0 flex flex-col border-t border-slate-800" style={{ flex: '0 0 40%' }}>
          <div className="flex-1 overflow-y-auto">
            <AlienTray
              aliens={trayAliens}
              draggingId={draggingId}
              onPointerDown={handlePointerDown}
              vertical={false}
            />
          </div>
          <div className="shrink-0 px-4 pb-4 pt-2 bg-slate-900 border-t border-slate-800">
            <button
              onClick={submit}
              disabled={!isComplete}
              className={`
                w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase
                transition-all duration-200 active:scale-95
                ${isComplete
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }
              `}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {isComplete ? 'Submit Classification →' : `Place ${remaining} More`}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="flex-1 overflow-hidden hidden lg:flex min-h-0">
        <main className="flex-1 overflow-y-auto flex items-center justify-center p-6 min-w-0 bg-white">
          <PhyloTree
            aliens={aliens}
            placement={placement}
            draggingId={draggingId}
            overNode={overNode}
            onRemoveFromNode={removeFromNode}
            nodeResults={null}
            correctTree={null}
          />
        </main>
        <aside className="w-80 shrink-0 border-l border-slate-800 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AlienTray
              aliens={trayAliens}
              draggingId={draggingId}
              onPointerDown={handlePointerDown}
              vertical={true}
            />
          </div>
          <div className="shrink-0 p-4 bg-slate-900 border-t border-slate-800">
            <button
              onClick={submit}
              disabled={!isComplete}
              className={`
                w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase
                transition-all duration-200 active:scale-95
                ${isComplete
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }
              `}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {isComplete ? 'Submit →' : `Place ${remaining} More`}
            </button>
          </div>
        </aside>
      </div>

      {phase === PHASE.REVEAL && result && (
        <RevealOverlay result={result} rule={rule} onNext={nextRound} />
      )}
    </div>
  )
}