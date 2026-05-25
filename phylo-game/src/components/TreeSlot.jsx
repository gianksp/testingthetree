// src/components/TreeSlot.jsx
import AlienCard from './AlienCard'

export default function TreeSlot({
    alien,
    onDrop,
    onDragOver,
    onDragLeave,
    isOver,
    correct = null,
    onRemove,
}) {
    const borderColor =
        correct === true ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/20' :
            correct === false ? 'border-red-500 bg-red-950/40 shadow-lg shadow-red-500/20' :
                isOver ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/30' :
                    alien ? 'border-slate-600 bg-slate-800' :
                        'border-slate-700 bg-slate-900 border-dashed'

    const pulse = isOver ? 'animate-pulse' : ''

    if (!alien) {
        return (
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`
          w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center
          transition-all duration-150 ${borderColor} ${pulse}
        `}
            >
                {isOver ? (
                    <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                ) : (
                    <>
                        <svg className="w-5 h-5 text-slate-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[9px] text-slate-600 tracking-wider">DROP</span>
                    </>
                )}
            </div>
        )
    }

    return (
        <div
            className={`rounded-xl border-2 transition-all duration-300 ${borderColor} relative group`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            <AlienCard
                alien={alien}
                size="sm"
                showTraits={false}
            />
            {/* remove button — tap to send back to tray */}
            {correct === null && (
                <button
                    onClick={onRemove}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 border border-slate-600
                     text-slate-400 text-[10px] flex items-center justify-center
                     opacity-0 group-hover:opacity-100 group-active:opacity-100
                     transition-opacity hover:bg-red-900 hover:text-red-300 hover:border-red-700"
                >
                    ✕
                </button>
            )}
        </div>
    )
}