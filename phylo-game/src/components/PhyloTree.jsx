// src/components/PhyloTree.jsx
import { useRef, useEffect, useCallback, useState } from 'react'

const NODE_LABELS = {
    0: 'Root Ancestor',
    1: 'Clade A',
    2: 'Clade B',
    3: 'Species I',
    4: 'Species II',
    5: 'Species III',
}

const EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]]

function TreeNode({
    nodeId, alien, isOver, correct,
    onRemove, nodeRef,
}) {
    const hasAlien = !!alien

    const borderCls =
        correct === true ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' :
            correct === false ? 'border-red-500 shadow-lg shadow-red-500/30' :
                isOver ? 'border-cyan-400 shadow-lg shadow-cyan-400/40' :
                    hasAlien ? 'border-slate-300' :
                        'border-slate-400 border-dashed'

    const bgCls =
        correct === true ? 'bg-emerald-50' :
            correct === false ? 'bg-red-50' :
                isOver ? 'bg-cyan-50' :
                    hasAlien ? 'bg-white' :
                        'bg-slate-50'

    return (
        <div className="flex flex-col items-center gap-2">
            <span
                className="text-[9px] md:text-[10px] font-bold tracking-widest text-slate-400 uppercase"
                style={{ fontFamily: 'Orbitron, monospace' }}
            >
                {NODE_LABELS[nodeId]}
            </span>

            {/* data-node-id is how elementsFromPoint identifies this as a drop target */}
            <div
                ref={nodeRef}
                data-node-id={nodeId}
                className={`
          group relative rounded-2xl border-2 flex items-center justify-center
          transition-all duration-150 touch-none pointer-events-auto
          w-20 h-20 md:w-32 md:h-32
          ${borderCls} ${bgCls}
          ${isOver ? 'scale-110' : ''}
        `}
            >
                {hasAlien ? (
                    <>
                        {/* img must NOT intercept pointer — data-node-id on parent handles it */}
                        <img
                            src={`/aliens/${alien.file}`}
                            alt={alien.name}
                            draggable={false}
                            className="w-full h-full object-contain p-2 rounded-2xl pointer-events-none"
                        />
                        {correct === null && (
                            <button
                                onClick={onRemove}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full z-10
                           bg-slate-700 border border-slate-600 text-slate-400 text-xs
                           flex items-center justify-center opacity-0 group-hover:opacity-100
                           hover:bg-red-900 hover:text-red-300 transition-all"
                            >
                                ✕
                            </button>
                        )}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                            <span className="text-[9px] text-slate-500 font-medium">{alien.name}</span>
                        </div>
                    </>
                ) : (
                    /* inner content must NOT intercept pointer either */
                    <div className="flex flex-col items-center gap-1 pointer-events-none">
                        {isOver ? (
                            <span className="text-cyan-400 text-2xl leading-none font-light">+</span>
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[9px] text-slate-400 tracking-widest uppercase">Drop</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function PhyloTree({
    aliens, placement, draggingId, overNode,
    onRemoveFromNode,
    nodeResults = null, correctTree = null,
}) {
    const containerRef = useRef(null)
    const nodeRefs = useRef({})
    const [lines, setLines] = useState([])

    const alienByInstanceId = Object.fromEntries(aliens.map(a => [a.instanceId, a]))

    const getAlienAtNode = (nodeId) => {
        if (correctTree) return correctTree[nodeId] ?? null
        const iid = placement[nodeId]
        return iid ? alienByInstanceId[iid] : null
    }

    const measureLines = useCallback(() => {
        if (!containerRef.current) return
        const cr = containerRef.current.getBoundingClientRect()
        const centers = {}
        for (const [id, ref] of Object.entries(nodeRefs.current)) {
            if (!ref) continue
            const r = ref.getBoundingClientRect()
            centers[id] = {
                x: r.left + r.width / 2 - cr.left,
                y: r.top + r.height / 2 - cr.top,
            }
        }
        setLines(
            EDGES
                .filter(([a, b]) => centers[a] && centers[b])
                .map(([a, b]) => ({
                    key: `${a}-${b}`,
                    x1: centers[a].x, y1: centers[a].y,
                    x2: centers[b].x, y2: centers[b].y,
                }))
        )
    }, [])

    useEffect(() => {
        measureLines()
        const ro = new ResizeObserver(measureLines)
        if (containerRef.current) ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [measureLines])

    useEffect(() => { measureLines() }, [placement, correctTree, measureLines])

    const setNodeRef = (nodeId) => (el) => { nodeRefs.current[nodeId] = el }

    const nodeProps = (nodeId) => ({
        nodeId,
        alien: getAlienAtNode(nodeId),
        isOver: overNode === nodeId && !!draggingId,
        correct: nodeResults ? nodeResults[nodeId] : null,
        onRemove: () => onRemoveFromNode(nodeId),
        nodeRef: setNodeRef(nodeId),
    })

    return (
        <div ref={containerRef} className="relative w-full select-none py-8 px-6">

            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                {lines.map(({ key, x1, y1, x2, y2 }) => (
                    <line
                        key={key} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
                    />
                ))}
            </svg>

            {/* Row 0 — root */}
            <div className="flex justify-center mb-16">
                <TreeNode {...nodeProps(0)} />
            </div>

            {/* Row 1 — internal nodes */}
            <div className="flex justify-around mb-16 px-4">
                <TreeNode {...nodeProps(1)} />
                <TreeNode {...nodeProps(2)} />
            </div>

            {/* Row 2 — leaves */}
            <div className="flex justify-around px-2">
                <div className="flex gap-8 md:gap-12">
                    <TreeNode {...nodeProps(3)} />
                    <TreeNode {...nodeProps(4)} />
                </div>
                <TreeNode {...nodeProps(5)} />
            </div>

        </div>
    )
}