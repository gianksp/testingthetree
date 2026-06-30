function Trophy({ style, size = 90, faded = false }) {
    return (
        <img
            src={`${import.meta.env.BASE_URL}images/plastic_trophy.png`}
            alt=""
            className={`absolute select-none ${faded ? "opacity-40 saturate-50" : "drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]"
                }`}
            style={{ width: size, ...style }}
            draggable={false}
        />
    );
}

export default function WapperScreen({ onContinue, onClose }) {
    const asModal = !!onClose;

    const card = (
        <div
            className={
                asModal
                    ? "relative w-full max-w-md rounded-3xl border-2 border-yellow-500/40 bg-black px-4 py-8 text-center"
                    : "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-10 text-center"
            }
            style={
                asModal
                    ? undefined
                    : { backgroundImage: "radial-gradient(circle at 50% 15%, #1a0a2e 0%, #000 70%)" }
            }
        >
            {asModal && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 rounded-full border border-slate-700 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                    ✕
                </button>
            )}

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
                Congratulations
            </p>
            <h1 className="mt-3 text-3xl font-black uppercase text-white sm:text-5xl">
                You Win <span className="text-yellow-400">The WAPPER</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                You're alive and breathing — so here it is, on the house. Everyone
                gets one. That's kind of the point.
            </p>

            <div className="relative mt-10 h-64 w-full max-w-md sm:h-80">
                {/* cardboard shipping box */}
                <div
                    className="absolute bottom-0 left-1/2 h-28 w-56 -translate-x-1/2 rounded-sm sm:h-36 sm:w-72"
                    style={{
                        background:
                            "linear-gradient(160deg, #b9803f 0%, #8a5a28 60%, #6e4720 100%)",
                        transform: "translateX(-50%) rotate(-3deg)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.5)",
                    }}
                >
                    <div className="absolute inset-x-2 top-2 h-1.5 rounded bg-black/20" />
                    <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wide text-black/40 sm:text-xs">
                        500 units · Hoboken NJ
                    </div>
                </div>

                {/* trophies spilling out */}
                <Trophy style={{ bottom: 70, left: "20%", transform: "rotate(-18deg)" }} size={70} faded />
                <Trophy style={{ bottom: 60, left: "62%", transform: "rotate(12deg)" }} size={64} faded />
                <Trophy style={{ bottom: 95, left: "40%", transform: "rotate(-4deg)" }} size={100} />
                <Trophy style={{ bottom: 50, left: "8%", transform: "rotate(28deg)" }} size={56} faded />
                <Trophy style={{ bottom: 40, left: "78%", transform: "rotate(-22deg)" }} size={60} faded />
            </div>

            <p className="mt-8 text-[11px] italic text-slate-500">
                "Tautologia Semper Vera Est" — tautologies are always true.
            </p>

            {asModal ? (
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition hover:bg-yellow-300 active:scale-95"
                >
                    Close
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-6 rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition hover:bg-yellow-300 active:scale-95"
                >
                    Enter the Machine →
                </button>
            )}
        </div>
    );

    if (!asModal) return card;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
                {card}
            </div>
        </div>
    );
}