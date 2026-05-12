import type { TreeNode } from "../utils/types";
import { xForNode, TREE_CONSTANTS } from "../utils/treeLayout";

const { ANCESTRY_COLOR, CLADE_COLOR, ROW_H } = TREE_CONSTANTS;

interface Edge {
    parent: TreeNode;
    child: TreeNode;
}

interface TreeEdgesProps {
    edges: Edge[];
    maxDepth: number;
    hasSelection: boolean;
    ancestorIds: Set<number>;
    descendantIds: Set<number>;
}

export function TreeEdges({
    edges,
    maxDepth,
    hasSelection,
    ancestorIds,
    descendantIds,
}: TreeEdgesProps) {
    return (
        <>
            {edges.map(({ parent: p, child: c }, idx) => {
                const onAncestorPath =
                    hasSelection && ancestorIds.has(p.id) && ancestorIds.has(c.id);
                const onDescendantPath =
                    hasSelection && descendantIds.has(p.id) && descendantIds.has(c.id);
                const active = onAncestorPath || onDescendantPath;

                const px = xForNode(p, maxDepth);
                const py = p.y * ROW_H + 14;
                const cx = xForNode(c, maxDepth);
                const cy = c.y * ROW_H + 14;

                let stroke = "#94a3b8";
                let strokeWidth = 1.5;

                if (onAncestorPath) {
                    stroke = ANCESTRY_COLOR;
                    strokeWidth = 3;
                } else if (onDescendantPath) {
                    stroke = CLADE_COLOR;
                    strokeWidth = 2.5;
                }

                return (
                    <g key={idx} opacity={!hasSelection ? 1 : active ? 1 : 0.12}>
                        <line x1={px} y1={py} x2={px} y2={cy} stroke={stroke} strokeWidth={strokeWidth} />
                        <line x1={px} y1={cy} x2={cx} y2={cy} stroke={stroke} strokeWidth={strokeWidth} />
                    </g>
                );
            })}
        </>
    );
}