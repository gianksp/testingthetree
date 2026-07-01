export default function Lever({ pulling, disabled, onPull, label, compact = false }) {
    const sizeClass = compact ? "h-16 w-11" : "h-28 w-20 sm:h-36 sm:w-24";

    return (
        <button
            type="button"
            onClick={onPull}
            disabled={disabled}
            aria-label="Pull the lever"
            className="flex shrink-0 flex-col items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <svg viewBox="0 0 120 170" className={sizeClass} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="leverKnob" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fca5a5" />
                        <stop offset="45%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                    <linearGradient id="leverMetal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#52525b" />
                        <stop offset="100%" stopColor="#09090b" />
                    </linearGradient>
                </defs>

                {/* housing / base */}
                <rect x="15" y="120" width="90" height="38" rx="10" fill="url(#leverMetal)" stroke="#facc15" strokeOpacity="0.35" />
                <circle cx="82" cy="139" r="11" fill="#18181b" stroke="#facc15" strokeOpacity="0.5" />

                {/* arm, rotates around the pivot */}
                <g
                    style={{
                        transform: `rotate(${pulling ? 42 : 0}deg)`,
                        transformOrigin: "82px 139px",
                        transition: "transform 0.45s cubic-bezier(.34,1.56,.64,1)",
                    }}
                >
                    <rect x="78" y="42" width="8" height="97" rx="4" fill="url(#leverMetal)" />
                    <circle cx="82" cy="36" r="17" fill="url(#leverKnob)" stroke="#450a0a" strokeWidth="1.5" />
                    <circle cx="76" cy="30" r="5" fill="#fecaca" opacity="0.75" />
                </g>
            </svg>

            {label && (
                <span className="rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black shadow-[0_0_16px_rgba(250,204,21,0.5)] sm:text-sm">
                    {label}
                </span>
            )}
        </button>
    );
}