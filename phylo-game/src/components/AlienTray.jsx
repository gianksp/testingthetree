// src/components/AlienTray.jsx
import AlienCard from './AlienCard'

export default function AlienTray({
    aliens, draggingId, onPointerDown, vertical = false,
}) {
    return (
        <div className={`w-full bg-slate-950 ${vertical ? 'h-full flex flex-col' : ''}`}>

            {/* header */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span
                        className="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                        Specimen Tray
                    </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">
                    {aliens.length} / 6
                </span>
            </div>

            {/* cards container */}
            <div className={`
        mx-3 mb-3 rounded-xl bg-slate-900 border border-slate-800 p-3
        ${vertical ? 'flex-1 overflow-y-auto' : ''}
      `}>
                {aliens.length === 0 ? (
                    <div className="flex items-center justify-center py-6 gap-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-slate-500 italic">All placed</span>
                    </div>
                ) : vertical ? (
                    <div className="grid grid-cols-1 gap-3">
                        {aliens.map((alien, i) => (
                            <div
                                key={alien.instanceId}
                                onPointerDown={(e) => onPointerDown(e, alien)}
                                className={`
                  rounded-xl border-2 bg-white cursor-grab active:cursor-grabbing
                  transition-all duration-150 select-none touch-none
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40
                  ${draggingId === alien.instanceId
                                        ? 'opacity-40 scale-95 border-slate-300'
                                        : 'border-slate-300 hover:border-cyan-400'
                                    }
                `}
                            >
                                <AlienCard
                                    alien={alien}
                                    isDragging={draggingId === alien.instanceId}
                                    size="lg"
                                    showTraits={true}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {aliens.map((alien, i) => (
                            <div
                                key={alien.instanceId}
                                className="snap-start shrink-0 flex flex-col items-center gap-1"
                            >
                                <div
                                    onPointerDown={(e) => onPointerDown(e, alien)}
                                    className={`
                    w-32 h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden
                    rounded-xl border-2 bg-white cursor-grab active:cursor-grabbing
                    transition-all duration-150 select-none
                    hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40
                    ${draggingId === alien.instanceId
                                            ? 'opacity-40 scale-95 border-slate-300 touch-none'
                                            : 'border-slate-300 hover:border-cyan-400 touch-pan-x'
                                        }
                  `}
                                    style={{ scrollbarWidth: 'none' }}
                                >
                                    <AlienCard
                                        alien={alien}
                                        isDragging={draggingId === alien.instanceId}
                                        size="md"
                                        showTraits={true}
                                    />
                                </div>
                                {i === 0 && !draggingId && (
                                    <span className="text-[8px] text-slate-700 tracking-widest uppercase animate-pulse">
                                        drag me
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}