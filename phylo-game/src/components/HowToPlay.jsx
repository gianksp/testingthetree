const BASE = import.meta.env.BASE_URL

export const ALIENS_BASE_URL = `${BASE}`

// src/components/HowToPlay.jsx
export default function HowToPlay({ onStart }) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_70%)] pointer-events-none" />

            <div className="relative w-full max-w-lg mx-auto flex flex-col items-center px-5 pb-10">

                {/* title */}
                <div className="w-full text-center pt-12 my-4">
                    <h1
                        className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                        Xenobiology<span className="text-cyan-400"> Classification Lab</span>
                    </h1>
                </div>

                {/* alien + mission card */}
                <div className="relative w-full">
                    <div className="flex justify-center">
                        <img
                            src={`${ALIENS_BASE_URL}logo.png`}
                            alt="mascot"
                            className="w-full max-w-xs sm:max-w-sm h-auto object-contain relative z-10"
                            style={{
                                filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
                                marginBottom: '-70px',
                            }}
                        />
                    </div>

                    <div className="relative z-0 bg-slate-900 border border-purple-900/60 rounded-2xl px-5 pb-5 pt-14">
                        <p className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase mb-3">
                            ▸ Mission Briefing
                        </p>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            Six alien specimens have been captured from a remote planet. Determine the{' '}
                            <span className="text-white font-semibold">evolutionary tree</span>{' '}
                            by dragging each specimen into their correct position.
                        </p>
                    </div>
                </div>

                {/* steps */}
                <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-4">
                    <p className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase mb-4">
                        ▸ How To Play
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            { n: '01', text: 'Drag specimens from the tray into the tree slots' },
                            { n: '02', text: 'Fill all 6 nodes: root, internal, and leaf' },
                            { n: '03', text: 'Hit Submit to reveal the true evolutionary path' },
                            { n: '04', text: 'Score points for each correctly placed specimen' },
                        ].map(({ n, text }) => (
                            <div key={n} className="flex items-start gap-3">
                                <span className="text-[10px] font-black text-cyan-400 font-mono mt-0.5 shrink-0">
                                    {n}
                                </span>
                                <span className="text-sm sm:text-base text-slate-300">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* hint */}
                <div className="w-full bg-violet-950 border border-violet-800 rounded-xl px-4 py-3 mt-4">
                    <p className="text-sm text-violet-300 text-center">
                        💡 The <span className="text-white font-semibold">Hint</span> chip shows which
                        trait category matters, but not how it matters
                    </p>
                </div>

                {/* start */}
                <button
                    onClick={onStart}
                    className="cursor-pointer mt-4 w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-black text-base sm:text-lg tracking-widest uppercase transition-all active:scale-95 hover:bg-cyan-300"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                >
                    Begin Classification →
                </button>

            </div>
        </div>
    )
}