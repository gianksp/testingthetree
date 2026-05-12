interface SequenceRulerProps {
    maxSeqLen: number;
    seqX: number;
    residueBoxW: number;
}

export function SequenceRuler({ maxSeqLen, seqX, residueBoxW }: SequenceRulerProps) {
    if (maxSeqLen === 0) return null;

    return (
        <>
            {Array.from({ length: Math.ceil(maxSeqLen / 10) }, (_, ti) => {
                const pos = ti * 10;
                const rx = seqX + pos * residueBoxW + residueBoxW / 2;

                return (
                    <g key={ti}>
                        <line x1={rx} y1={2} x2={rx} y2={10} stroke="#cbd5e1" strokeWidth={1} />
                        <text
                            x={rx}
                            y={9}
                            textAnchor="middle"
                            fontSize={7}
                            fill="#64748b"
                            fontFamily="monospace"
                        >
                            {pos + 1}
                        </text>
                    </g>
                );
            })}
        </>
    );
}