// src/components/RevealOverlay.jsx

const NODE_LABELS = {
    0: 'Root Ancestor',
    1: 'Clade A',
    2: 'Clade B',
    3: 'Species I',
    4: 'Species II',
    5: 'Species III',
}

const NODE_DESCRIPTIONS = (rule) => rule.cladeDescriptions ?? {}

const BASE = import.meta.env.BASE_URL

export const ALIENS_BASE_URL = `${BASE}aliens/`

const SCORE_DATA = {
    0: { label: 'Incorrect', sub: 'The phylogeny had other plans.', color: 'text-red-400' },
    1: { label: '1 / 6', sub: 'One correct placement.', color: 'text-orange-400' },
    2: { label: '2 / 6', sub: 'Getting warmer.', color: 'text-amber-400' },
    3: { label: '3 / 6', sub: 'Halfway there.', color: 'text-yellow-400' },
    4: { label: '4 / 6', sub: 'Strong instincts.', color: 'text-lime-400' },
    5: { label: '5 / 6', sub: 'Almost — one ancestor slipped.', color: 'text-cyan-400' },
    6: { label: 'Perfect', sub: 'You cracked the hidden rule.', color: 'text-emerald-400' },
}

// Mini alien image
function AlienThumb({ alien, correct }) {
    if (!alien) return (
        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-slate-600 text-xs">?</span>
        </div>
    )
    return (
        <div className={`
      w-12 h-12 rounded-lg border-2 overflow-hidden bg-white
      ${correct === true ? 'border-emerald-400' :
                correct === false ? 'border-red-500' : 'border-slate-300'}
    `}>
            <img
                src={`${ALIENS_BASE_URL}${alien.file}`}
                alt={alien.name}
                className="w-full h-full object-contain"
                draggable={false}
            />
        </div>
    )
}

// The cladogram tree rendered with correct aliens filled in
function RevealTree({ correctTree, nodeResults }) {
    const nodeDescriptions = {}

    const NodeCell = ({ nodeId }) => {
        const alien = correctTree[nodeId]
        const correct = nodeResults ? nodeResults[nodeId] : null
        return (
            <div className="flex flex-col items-center gap-1">
                <span
                    className="text-[8px] font-bold tracking-widest uppercase text-slate-500"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    {NODE_LABELS[nodeId]}
                </span>
                <div className={`
          relative rounded-xl border-2 overflow-hidden bg-white
          w-14 h-14
          ${correct === true ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' :
                        correct === false ? 'border-red-500 shadow-lg shadow-red-500/20' :
                            'border-slate-300'}
        `}>
                    {alien && (
                        <img
                            src={`${ALIENS_BASE_URL}${alien.file}`}
                            alt={alien?.name}
                            className="w-full h-full object-contain p-0.5"
                            draggable={false}
                        />
                    )}
                    {/* correct/wrong badge */}
                    <div className={`
            absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold
            ${correct === true ? 'bg-emerald-400 text-white' :
                            correct === false ? 'bg-red-500 text-white' : 'hidden'}
          `}>
                        {correct === true ? '✓' : '✗'}
                    </div>
                </div>
                {alien && (
                    <span className="text-[8px] text-slate-500 text-center max-w-16 leading-tight">
                        {alien.name}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="relative w-full select-none py-4 px-2">
            {/* Root */}
            <div className="flex justify-center mb-6">
                <NodeCell nodeId={0} />
            </div>

            {/* SVG connectors — simple static version for reveal */}
            <div className="relative">
                <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: 40, overflow: 'visible' }}>
                    <line x1="50%" y1="0" x2="28%" y2="40" stroke="#334155" strokeWidth="1.5" />
                    <line x1="50%" y1="0" x2="72%" y2="40" stroke="#334155" strokeWidth="1.5" />
                </svg>
                <div style={{ height: 40 }} />
            </div>

            {/* Internal nodes */}
            <div className="flex justify-around mb-6 px-4">
                <NodeCell nodeId={1} />
                <NodeCell nodeId={2} />
            </div>

            {/* SVG connectors row 2 */}
            <div className="relative">
                <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: 40, overflow: 'visible' }}>
                    {/* left splits */}
                    <line x1="28%" y1="0" x2="18%" y2="40" stroke="#334155" strokeWidth="1.5" />
                    <line x1="28%" y1="0" x2="38%" y2="40" stroke="#334155" strokeWidth="1.5" />
                    {/* right single */}
                    <line x1="72%" y1="0" x2="72%" y2="40" stroke="#334155" strokeWidth="1.5" />
                </svg>
                <div style={{ height: 40 }} />
            </div>

            {/* Leaves */}
            <div className="flex justify-around px-2">
                <div className="flex gap-4">
                    <NodeCell nodeId={3} />
                    <NodeCell nodeId={4} />
                </div>
                <NodeCell nodeId={5} />
            </div>
        </div>
    )
}

export default function RevealOverlay({ result, rule, onNext }) {
    const { score, nodeResults, correctTree } = result
    const data = SCORE_DATA[score] ?? SCORE_DATA[0]

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-y-auto">

            {/* score header */}
            <div className="flex flex-col items-center pt-10 pb-6 px-6 bg-slate-900 border-b border-slate-800">
                <div
                    className={`text-4xl font-black mb-1 tracking-widest ${data.color}`}
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    {data.label}
                </div>
                <p className="text-sm text-slate-400 text-center">{data.sub}</p>

                {/* score bar */}
                <div className="flex gap-1.5 mt-4">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className={`
              w-7 h-2 rounded-full transition-all
              ${i < score ? 'bg-emerald-400' : 'bg-slate-700'}
            `} />
                    ))}
                </div>
                <p className="text-xs text-slate-600 mt-1">{score} / 6 nodes correct</p>
            </div>

            {/* hidden rule */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-violet-950 border border-violet-800">
                <p
                    className="text-[10px] font-bold tracking-widest text-violet-400 uppercase mb-1"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    ▸ The Hidden Rule
                </p>
                <p className="text-base font-semibold text-white leading-snug">{rule.label}</p>
                <div className="mt-2 inline-flex items-center gap-2 bg-violet-900/50 rounded-lg px-3 py-1">
                    <span className="text-[10px] text-violet-400 uppercase tracking-wider">Key trait:</span>
                    <span className="text-sm font-mono font-bold text-violet-200">{rule.traitKey}</span>
                </div>
            </div>

            {/* correct phylo tree */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-white border border-slate-200">
                <p
                    className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    ▸ Correct Phylogenetic Tree
                </p>
                <RevealTree correctTree={correctTree} nodeResults={nodeResults} />
            </div>

            {/* evolutionary narrative */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <p
                    className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase mb-3"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    ▸ Evolutionary Narrative
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {rule.narrative}
                </p>

                {/* per-node descriptions */}
                <div className="mt-4 flex flex-col gap-2">
                    {Object.entries(rule.cladeDescriptions ?? {}).map(([nodeId, desc]) => {
                        const alien = correctTree[parseInt(nodeId)]
                        const correct = nodeResults ? nodeResults[parseInt(nodeId)] : null
                        return (
                            <div key={nodeId} className={`
                flex items-center gap-3 p-2 rounded-xl border
                ${correct === true ? 'border-emerald-800 bg-emerald-950/40' :
                                    correct === false ? 'border-red-900 bg-red-950/30' :
                                        'border-slate-800 bg-slate-900'}
              `}>
                                <span className={`text-xs font-bold w-4 shrink-0
                  ${correct === true ? 'text-emerald-400' : correct === false ? 'text-red-400' : 'text-slate-500'}`}>
                                    {correct === true ? '✓' : correct === false ? '✗' : '·'}
                                </span>
                                {alien && (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                                        <img src={`${ALIENS_BASE_URL}${alien.file}`} alt={alien.name}
                                            className="w-full h-full object-contain" draggable={false} />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                                        {NODE_LABELS[parseInt(nodeId)]}
                                        {alien ? ` — ${alien.name}` : ''}
                                    </span>
                                    <span className="text-xs text-slate-400 leading-tight">{desc}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* next */}
            <div className="px-4 pb-12 mt-6">
                <button
                    onClick={onNext}
                    className="w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-black
                     text-base tracking-widest uppercase transition-all active:scale-95 hover:bg-cyan-300"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    Next Round →
                </button>
            </div>
        </div>
    )
}