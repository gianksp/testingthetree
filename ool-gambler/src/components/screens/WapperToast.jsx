export default function WapperToast({ runKey }) {
    if (!runKey) return null; // nothing yet on first load, no run happened

    return (
        <div
            key={runKey}
            className="pointer-events-none fixed inset-x-0 top-3 z-[150] flex justify-center px-3"
        >
            <div className="wapper-toast flex items-center gap-2 rounded-full border border-yellow-400/60 bg-black/90 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] sm:text-sm">
                <span>🏆</span>
                <span>WAPPER won — you exist, therefore you win</span>
            </div>
        </div>
    );
}