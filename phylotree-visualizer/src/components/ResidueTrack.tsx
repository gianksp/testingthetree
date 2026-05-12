import { AA_COLORS, AA_H } from "../utils/styles";
import { residueTextColor, TREE_CONSTANTS } from "../utils/treeLayout";
import type { Tooltip } from "../utils/types";

const { ANCESTRY_COLOR, CLADE_COLOR, SELECTED_COLOR } = TREE_CONSTANTS;

interface ResidueTrackProps {
    seq: string;
    maxSeqLen: number;
    seqX: number;
    residueBoxW: number;
    ny: number;
    nodeName: string;
    isSelected: boolean;
    inAncestors: boolean;
    lit: boolean;
    seqOpacity: number;
    activeConsensus: string;
    showSequenceLetter: boolean;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    setTooltip: (t: Tooltip | null) => void;
    setFastaPanelLeaf: (name: string) => void;
}

export function ResidueTrack({
    seq,
    maxSeqLen,
    seqX,
    residueBoxW,
    ny,
    nodeName,
    isSelected,
    inAncestors,
    lit,
    seqOpacity,
    activeConsensus,
    showSequenceLetter,
    canvasRef,
    setTooltip,
    setFastaPanelLeaf,
}: ResidueTrackProps) {
    if (seq.length === 0) return null;

    return (
        <g opacity={seqOpacity}>
            {Array.from({ length: Math.min(seq.length, maxSeqLen) }, (_, i) => {
                const ch = seq[i];
                const color = AA_COLORS[ch.toUpperCase()] ?? "#e5e7eb";
                const bx = seqX + i * residueBoxW;
                const by = ny - AA_H / 2;

                const consensusCh = activeConsensus[i];
                const residueCh = ch.toUpperCase();
                const isDiff =
                    Boolean(activeConsensus) &&
                    Boolean(consensusCh) &&
                    residueCh !== consensusCh;

                const residueOpacity = activeConsensus ? (isDiff ? 1 : 0.15) : 1;

                return (
                    <g
                        key={i}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFastaPanelLeaf(nodeName);
                        }}
                        onMouseEnter={(e) => {
                            const rect = canvasRef.current?.getBoundingClientRect();
                            if (!rect) return;
                            setTooltip({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top - 32,
                                char: ch,
                                pos: i + 1,
                                taxon: nodeName,
                            });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <rect
                            x={bx}
                            y={by}
                            width={residueBoxW}
                            height={AA_H}
                            fill={color}
                            opacity={residueOpacity}
                            rx={showSequenceLetter ? 1.5 : 0.5}
                        />

                        {showSequenceLetter && ch !== "-" && (
                            <text
                                x={bx + residueBoxW / 2}
                                y={by + AA_H / 2 + 3}
                                textAnchor="middle"
                                fontSize={8}
                                fontFamily="'JetBrains Mono', monospace"
                                fontWeight={700}
                                fill={residueTextColor(ch)}
                                pointerEvents="none"
                                opacity={residueOpacity}
                            >
                                {ch}
                            </text>
                        )}

                        {isDiff && (
                            <rect
                                x={bx - 0.5}
                                y={by - 0.5}
                                width={residueBoxW + 1}
                                height={AA_H + 1}
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth={1.5}
                                rx={1}
                            />
                        )}
                    </g>
                );
            })}

            {lit && (
                <rect
                    x={seqX - 1}
                    y={ny - AA_H / 2 - 1}
                    width={seq.length * residueBoxW + 1}
                    height={AA_H + 2}
                    fill="none"
                    stroke={isSelected ? SELECTED_COLOR : inAncestors ? ANCESTRY_COLOR : CLADE_COLOR}
                    strokeWidth={isSelected ? 1.5 : 1}
                    rx={2}
                    opacity={isSelected ? 0.9 : 0.45}
                />
            )}
        </g>
    );
}