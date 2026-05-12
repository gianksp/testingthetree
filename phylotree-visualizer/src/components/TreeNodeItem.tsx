import type { TreeNode, Selection, Tooltip, FastaMap } from "../utils/types";
import {
    xForNode,
    getNodeColor,
    getNodeStroke,
    TREE_CONSTANTS,
} from "../utils/treeLayout";
import { ResidueTrack } from "./ResidueTrack";
import { AA_W_COMPACT, AA_W_EXPANDED } from "../utils/styles";

const { ROW_H, LABEL_END, ANCESTRY_COLOR, CLADE_COLOR, SELECTED_COLOR } = TREE_CONSTANTS;

interface TreeNodeItemProps {
    node: TreeNode;
    maxDepth: number;
    totalSvgW: number;
    seqX: number;
    maxSeqLen: number;
    hasSelection: boolean;
    selection: Selection | null;
    ancestorIds: Set<number>;
    descendantIds: Set<number>;
    activeConsensus: string;
    fastaMap: FastaMap;
    showSupport: boolean;
    showBranchLen: boolean;
    showSequenceLetter: boolean;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    setTooltip: (t: Tooltip | null) => void;
    setFastaPanelLeaf: (name: string) => void;
    onNodeClick: (node: TreeNode) => void;
    onToggleCollapse: (nodeId: number) => void;
}

export function TreeNodeItem({
    node,
    maxDepth,
    totalSvgW,
    seqX,
    maxSeqLen,
    hasSelection,
    selection,
    ancestorIds,
    descendantIds,
    activeConsensus,
    fastaMap,
    showSupport,
    showBranchLen,
    showSequenceLetter,
    canvasRef,
    setTooltip,
    setFastaPanelLeaf,
    onNodeClick,
    onToggleCollapse,
}: TreeNodeItemProps) {
    const nx = xForNode(node, maxDepth);
    const ny = node.y * ROW_H + 14;
    const isLeaf = !node.children.length || node.collapsed;
    const isSelected = selection?.nodeId === node.id;
    const inAncestors = hasSelection && ancestorIds.has(node.id);
    const inDescendants = hasSelection && descendantIds.has(node.id);
    const lit = inAncestors || inDescendants;
    const dimmed = hasSelection && !lit;
    const seq = fastaMap[node.name] ?? "";
    const seqOpacity = !hasSelection ? 1 : lit ? 1 : 0.06;
    const residueBoxW = showSequenceLetter ? AA_W_EXPANDED : AA_W_COMPACT;

    const nodeColor = getNodeColor(isSelected, inAncestors, inDescendants, isLeaf);
    const nodeStroke = getNodeStroke(isSelected, inAncestors, inDescendants);

    const approxParentX = isLeaf
        ? xForNode({ ...node, children: [{}] } as TreeNode, maxDepth)
        : xForNode({ ...node, x: node.x - 1 } as TreeNode, maxDepth);

    return (
        <g
            opacity={dimmed ? 0.15 : 1}
            onClick={() => onNodeClick(node)}
            onDoubleClick={() => {
                if (!isLeaf || node.collapsed) onToggleCollapse(node.id);
            }}
            style={{ cursor: "pointer" }}
        >
            {/* Hit area */}
            <rect x={nx - 20} y={ny - 20} width={40} height={40} fill="transparent" />

            {isLeaf ? (
                <>
                    {lit && (
                        <rect
                            x={0}
                            y={ny - ROW_H / 2}
                            width={totalSvgW}
                            height={ROW_H}
                            fill={
                                isSelected
                                    ? "#11182710"
                                    : inAncestors
                                        ? "#f59e0b12"
                                        : inDescendants
                                            ? "#8a41d312"
                                            : "#00000008"
                            }
                        />
                    )}

                    <line
                        x1={nx + 5}
                        y1={ny}
                        x2={LABEL_END - 2}
                        y2={ny}
                        stroke={inAncestors ? "#f59e0b66" : inDescendants ? "#8a41d366" : "#e2e8f0"}
                        strokeWidth={1}
                        strokeDasharray="2,3"
                    />

                    <circle
                        cx={nx}
                        cy={ny}
                        r={isSelected ? 6 : 5}
                        fill={nodeColor}
                        stroke={nodeStroke}
                        strokeWidth={isSelected ? 2 : 1.5}
                    />

                    <text
                        x={LABEL_END}
                        y={ny + 4}
                        textAnchor="end"
                        fontSize={isSelected ? 11 : 10}
                        fontFamily="'JetBrains Mono',monospace"
                        fontWeight={isSelected ? "700" : lit ? "600" : "400"}
                        fill={
                            isSelected
                                ? SELECTED_COLOR
                                : inAncestors
                                    ? ANCESTRY_COLOR
                                    : inDescendants
                                        ? CLADE_COLOR
                                        : "#64748b"
                        }
                    >
                        {node.name}
                    </text>

                    <ResidueTrack
                        seq={seq}
                        maxSeqLen={maxSeqLen}
                        seqX={seqX}
                        residueBoxW={residueBoxW}
                        ny={ny}
                        nodeName={node.name}
                        isSelected={isSelected}
                        inAncestors={inAncestors}
                        lit={lit}
                        seqOpacity={seqOpacity}
                        activeConsensus={activeConsensus}
                        showSequenceLetter={showSequenceLetter}
                        canvasRef={canvasRef}
                        setTooltip={setTooltip}
                        setFastaPanelLeaf={setFastaPanelLeaf}
                    />
                </>
            ) : (
                <>
                    <polygon
                        points={`${nx},${ny - 7} ${nx + 6},${ny} ${nx},${ny + 7} ${nx - 6},${ny}`}
                        fill={nodeColor}
                        stroke={nodeStroke}
                        strokeWidth={isSelected ? 2.5 : lit ? 2 : 1.5}
                    />

                    {showSupport && node.support !== undefined && (
                        <text
                            x={nx - 8}
                            y={ny - 10}
                            textAnchor="middle"
                            fontSize={9}
                            fontFamily="monospace"
                            fill={
                                node.support >= 95
                                    ? "#10b981"
                                    : node.support >= 70
                                        ? "#f59e0b"
                                        : "#ef4444"
                            }
                        >
                            {node.support}
                        </text>
                    )}

                    {node.name && !node.support && (
                        <text
                            x={nx + 8}
                            y={ny + 4}
                            fontSize={8}
                            fontFamily="monospace"
                            fill={
                                isSelected
                                    ? SELECTED_COLOR
                                    : inAncestors
                                        ? ANCESTRY_COLOR
                                        : inDescendants
                                            ? CLADE_COLOR
                                            : "#64748b"
                            }
                        >
                            {node.name}
                        </text>
                    )}
                </>
            )}

            {showBranchLen &&
                node.length !== null &&
                node.length > 0 &&
                node.x > 0 && (
                    <text
                        x={(nx + Math.min(approxParentX, nx - 10)) / 2}
                        y={ny - 5}
                        textAnchor="middle"
                        fontSize={7}
                        fill="#94a3b8"
                        fontFamily="monospace"
                    >
                        {node.length.toFixed(3)}
                    </text>
                )}
        </g>
    );
}