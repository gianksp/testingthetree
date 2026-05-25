// src/components/DragGhost.jsx
export default function DragGhost({ file, x, y }) {
    if (!file) return null
    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
            }}
        >
            <div className="w-full h-full rounded-xl bg-white border-2 border-cyan-400
                      shadow-xl shadow-cyan-500/40 overflow-hidden opacity-90">
                <img
                    src={`/aliens/${file}`}
                    alt=""
                    className="w-full h-full object-contain p-1"
                    draggable={false}
                />
            </div>
        </div>
    )
}