import LightFrame from "./LightFrame";

export default function VegasIntro({ onPlay }) {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-black px-3 py-6 sm:py-8"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 50% 20%, #1a0a2e 0%, #000 70%)",
            }}
        >
            <LightFrame>
                <div className="rounded-2xl border-2 border-yellow-500/40 bg-black/60 p-4 text-center sm:p-10">
                    <h1 className="mt-3 text-2xl font-black uppercase tracking-tight sm:mt-4 sm:text-5xl">
                        <span className="text-white">Life </span>
                        <span
                            className="text-red-500"
                            style={{ textShadow: "0 0 12px rgba(239,68,68,0.8)" }}
                        >
                            Jackpot
                        </span>
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-lg sm:leading-7">
                        Pull the lever. Hit the jackpot. Create life.
                    </p>

                    <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-white/5 p-4 text-left sm:mt-6 sm:p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-300 sm:text-xs sm:tracking-[0.2em]">
                            How it works
                        </p>

                        <ul className="mt-3 space-y-2.5 text-[13px] leading-5 text-slate-300 sm:space-y-3 sm:text-sm sm:leading-6">
                            <li>
                                <strong className="text-white">Increase the odds.</strong> Each game has 10 tries with 10 steps.
                            </li>
                            <li>
                                <strong className="text-white">Pull the lever and win ONCE.</strong> If the probability is too low, you may not hit the jackpot. High enough, and you can hit the jackpot more than just once.
                            </li>
                        </ul>
                    </div>
                    <div className="mx-auto mt-4 max-w-xl rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-left sm:mt-5 sm:p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-yellow-400 sm:text-xs sm:tracking-[0.2em]">
                            🍀🍀 Enter The WAPPER 🍀🍀
                        </p>
                        <p className="mt-2 text-[13px] leading-5 text-slate-300 sm:text-sm sm:leading-6">
                            <strong className="text-white">The WAPPER </strong>is the{" "}
                            <strong className="text-white">W</strong>eak{" "}
                            <strong className="text-white">A</strong>nthropic{" "}
                            <strong className="text-white">P</strong>rinciple, dressed up as a free jackpot. Every game has at least one scenario that will always automatically win 🍀🍀🍀🍀
                        </p>
                        <p className="mt-2 text-[13px] leading-5 text-slate-300 sm:text-sm sm:leading-6">
                            The WAPPER would argue: "you exist, so someone had to win." True, but it explains nothing. It is just a cheap plastic trophy as a consolation prize.
                        </p>
                        <p className="mt-2 text-[13px] leading-5 text-slate-300 sm:text-sm sm:leading-6">
                            <strong className="text-cyan-300">Your real goal:</strong> ignore the clovers that will ensure an automatic win.
                            Set the odds so one environment wins for real—every step a genuine success checkmark ✓.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onPlay}
                        className="cursor-pointer mt-6 w-full rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition hover:bg-yellow-300 active:scale-95 sm:mt-8 sm:w-auto sm:px-8"
                    >
                        Pull the Lever →
                    </button>
                </div>
            </LightFrame>
        </div>
    );
}