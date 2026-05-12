import type { TreeNode } from "./types";

export const TREE_CONSTANTS = {
    ROW_H: 28,
    TREE_W: 220,
    LABEL_W: 120,
    get LABEL_END() {
        return this.TREE_W + this.LABEL_W;
    },
    get SEQ_X() {
        return this.LABEL_END + 12;
    },
    ANCESTRY_COLOR: "#f59e0b",
    CLADE_COLOR: "#8a41d3",
    SELECTED_COLOR: "#111827",
} as const;

export function xForNode(n: TreeNode, maxDepth: number, treeW = TREE_CONSTANTS.TREE_W): number {
    if (!n.children.length || n.collapsed) return treeW;
    return maxDepth === 0 ? 10 : (n.x / maxDepth) * (treeW - 14) + 10;
}

export function residueTextColor(ch: string): string {
    const darkResidues = new Set(["C", "F", "H", "P", "R"]);
    return darkResidues.has(ch.toUpperCase()) ? "#ffffff" : "#111827";
}

export function getNodeColor(
    isSelected: boolean,
    inAncestors: boolean,
    inDescendants: boolean,
    isLeaf: boolean
): string {
    if (isSelected) return TREE_CONSTANTS.SELECTED_COLOR;
    if (inAncestors) return TREE_CONSTANTS.ANCESTRY_COLOR;
    if (inDescendants) return TREE_CONSTANTS.CLADE_COLOR;
    return isLeaf ? "#64748b" : "#6366f1";
}

export function getNodeStroke(
    isSelected: boolean,
    inAncestors: boolean,
    inDescendants: boolean
): string {
    if (isSelected) return TREE_CONSTANTS.SELECTED_COLOR;
    if (inAncestors) return TREE_CONSTANTS.ANCESTRY_COLOR;
    if (inDescendants) return TREE_CONSTANTS.CLADE_COLOR;
    return "#cbd5e1";
}