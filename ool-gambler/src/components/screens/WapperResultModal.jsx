import LightFrame from "./LightFrame";

export default function WapperResultModal({ result, onClose, onAdjust }) {
    const wapApplied = result?.wapFilledEnv !== null && result?.wapFilledEnv !== undefined;
    const survivorCount = result?.survivors?.length ?? 0;
    const multiOrigin = survivorCount > 1;

    let icon = "🏆";
    let headline = (
        <>
            You Win <span className="text-yellow-400">The WAPPER</span>
        </>
    );
    let resultLine =
        "Nothing survived, and no fallback fired this time. Even so: you're here reading this, so the WAPPER still applies.";
    let boxTitle = "The Challenge";
    let boxBody =
        "Win without the WAPPER. Increase the odds until the life jackpot isn't just an observation after the fact.";
    let frameColor = "yellow";

    if (multiOrigin) {
        icon = "🧬";
        headline = (
            <>
                Hold On — <span className="text-cyan-300">{survivorCount} Independent Origins</span>
            </>
        );
        resultLine = `${survivorCount} different tries hit the jackpot on their own, without the WAPPER.`;
        boxTitle = "Why This Matters";
        boxBody =
            "If the odds make more than one origin possible, that's worth thinking about. You were only supposed to need one.";
        frameColor = "cyan";
    } else if (wapApplied) {
        resultLine =
            "Every lineage you tried failed. Lucky for you, the WAPPER kicked in anyway and we have at least one origin of life event. Here is your cheap plastic trophy as a consolation prize!";
    } else if (survivorCount === 1) {
        resultLine =
            "One environment made it to the end on its own. A single success is exactly what the weak anthropic principle predicts — you exist, so you win, regardless.";
    }

    const borderClass =
        frameColor === "cyan" ? "border-cyan-400/40" : "border-yellow-500/40";
    const boxBorderClass =
        frameColor === "cyan"
            ? "border-cyan-400/30 bg-cyan-400/5"
            : "border-yellow-500/30 bg-yellow-400/5";
    const boxTitleClass = frameColor === "cyan" ? "text-cyan-300" : "text-yellow-400";

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm"
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
                <LightFrame top={10} side={6}>
                    <div className={`relative rounded-2xl border-2 ${borderClass} bg-black px-5 py-7 text-center sm:px-8 sm:py-9`}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer absolute right-3 top-3 rounded-full border border-slate-700 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10"
                        >
                            ✕
                        </button>

                        {multiOrigin ? (
                            <div className="mx-auto flex h-20 w-20 items-center justify-center text-5xl sm:h-24 sm:w-24">
                                {icon}
                            </div>
                        ) : (
                            <img
                                src={`${import.meta.env.BASE_URL}images/plastic_trophy.png`}
                                alt=""
                                className="mx-auto h-48 w-auto drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)] sm:h-[480px]"
                                draggable={false}
                            />
                        )}

                        <h2 className="mt-3 text-xl font-black uppercase text-white sm:text-3xl">
                            {headline}
                        </h2>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">
                            {resultLine}
                        </p>

                        <div className={`mx-auto mt-5 max-w-sm rounded-2xl border p-4 ${boxBorderClass}`}>
                            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${boxTitleClass}`}>
                                {boxTitle}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-200">{boxBody}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {/* <button
                                type="button"
                                onClick={onAdjust}
                                className="cursor-pointer rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_16px_rgba(250,204,21,0.5)] transition hover:bg-yellow-300 active:scale-95"
                            >
                                {multiOrigin ? "Run It Again →" : "Crank the Odds →"}
                            </button> */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-full border border-slate-700 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </LightFrame>
            </div>
        </div>
    );
}