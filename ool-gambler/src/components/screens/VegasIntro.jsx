import LightFrame from "./LightFrame";

export default function VegasIntro({ onPlay }) {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-black px-3 py-8"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 50% 20%, #1a0a2e 0%, #000 70%)",
            }}
        >
            <LightFrame>
                <div className="rounded-2xl border-2 border-yellow-500/40 bg-black/60 p-6 text-center sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
                        Tautologies R Us Incorporated · Hoboken NJ
                    </p>

                    <h1 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-5xl">
                        <span className="text-white">Win </span>
                        <span className="text-cyan-400">Without </span>
                        <span
                            className="text-red-500"
                            style={{ textShadow: "0 0 12px rgba(239,68,68,0.8)" }}
                        >
                            The WAPPER!
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                        The <strong className="text-white">WAPPER</strong> is the{" "}
                        <strong className="text-white">W</strong>eak{" "}
                        <strong className="text-white">A</strong>nthropic{" "}
                        <strong className="text-white">P</strong>rinciple — science's
                        ultimate consolation prize. Anyone who plays the origin-of-life
                        gambling machine wins a WAPPER just by showing up. What explains
                        the origin of life? <em className="text-yellow-300">Who cares?</em>{" "}
                        We exist, so we couldn't ask the question unless we did exist.
                        Easy, right?
                    </p>

                    <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-slate-500">
                        Wapper trophies produced by Tautologies R Us Incorporated of
                        Hoboken, NJ. Available in cheap plastic, quantities starting at
                        500 units per shipping carton. Here, have one, on the house.
                    </p>

                    <button
                        type="button"
                        onClick={onPlay}
                        className="mt-8 rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] transition hover:bg-yellow-300 active:scale-95"
                    >
                        Pull the Lever →
                    </button>
                </div>
            </LightFrame>
        </div>
    );
}