// src/components/AlienCard.jsx
import { ALIENS_BASE_URL } from '../game/alienData'

const TRAIT_COLORS = {
    body: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    legs: 'bg-sky-100 text-sky-800 border-sky-200',
    head: 'bg-violet-100 text-violet-800 border-violet-200',
    eyes: 'bg-amber-100 text-amber-800 border-amber-200',
    mouth: 'bg-rose-100 text-rose-800 border-rose-200',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
}

function formatTrait(value) {
    if (!value && value !== 0) return '—'
    if (Array.isArray(value)) {
        if (value.length === 0) return 'none'
        const counts = {}
        value.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
        return Object.entries(counts).map(([k, n]) => n > 1 ? `${n}× ${k}` : k).join(', ')
    }
    if (typeof value === 'object') return `${value.count} ${value.type}`
    return String(value)
}

function TraitBadge({ label, value, traitKey }) {
    const cls = TRAIT_COLORS[traitKey] ?? 'bg-gray-100 text-gray-700 border-gray-200'
    return (
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${cls} whitespace-nowrap`}>
            {label}: {value}
        </span>
    )
}

export default function AlienCard({
    alien,
    size = 'md',
    showTraits = true,
    isDragging = false,
    onTap,
}) {
    const { traits, name, file } = alien
    const dim = size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20'

    return (
        <div
            onClick={onTap}
            className={`
        flex flex-col items-center gap-1.5 p-2 rounded-xl
        transition-all duration-150 select-none
        ${isDragging ? 'opacity-40' : 'opacity-100'}
        ${onTap ? 'cursor-pointer' : ''}
      `}
        >
            <div className={`${dim} rounded-lg overflow-hidden bg-white flex items-center justify-center`}>
                <img
                    src={`${ALIENS_BASE_URL}${file}`}
                    alt={name}
                    className="w-full h-full object-contain"
                    draggable={false}
                />
            </div>

            <span className="text-[11px] font-semibold text-slate-700 tracking-wide">
                {name}
            </span>

            {showTraits && (
                <div className="flex flex-wrap justify-center gap-1  max-w-[220px]">
                    {Object.entries(traits).map(([key, value]) => (
                        <TraitBadge
                            key={key}
                            traitKey={key}
                            label={key}
                            value={formatTrait(value)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}