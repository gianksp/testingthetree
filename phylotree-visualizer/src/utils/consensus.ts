import type { FastaMap, TreeNode } from "./types";
import { collectNodes, buildParentMap, findNode } from "../utils/parser";

function buildConsensusFromLeaves(
    leaves: TreeNode[],
    fastaMap: FastaMap
): string {
    const seqs = leaves
        .map((n) => fastaMap[n.name])
        .filter((seq): seq is string => Boolean(seq));

    if (!seqs.length) return "";

    const maxLen = Math.max(...seqs.map((s) => s.length));
    let consensus = "";

    for (let i = 0; i < maxLen; i++) {
        const counts: Record<string, number> = {};
        for (const seq of seqs) {
            const ch = (seq[i] ?? "-").toUpperCase();
            counts[ch] = (counts[ch] ?? 0) + 1;
        }
        consensus += Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    return consensus;
}

export function buildGlobalConsensus(root: TreeNode, fastaMap: FastaMap): string {
    const leaves = collectNodes(root).filter(
        (n) => !n.children.length || n.collapsed
    );
    return buildConsensusFromLeaves(leaves, fastaMap);
}

export function buildCladeConsensus(
    root: TreeNode,
    selectedNodeId: number,
    fastaMap: FastaMap
): string {
    const parentMap = buildParentMap(root);
    const selectedNode = findNode(root, selectedNodeId);
    if (!selectedNode) return "";

    const isLeaf = !selectedNode.children.length || selectedNode.collapsed;
    const parentNode = parentMap.get(selectedNode.id);
    const comparisonNode = isLeaf && parentNode ? parentNode : selectedNode;

    if (!comparisonNode) return "";

    const leaves = collectNodes(comparisonNode).filter(
        (n) => !n.children.length || n.collapsed
    );

    return buildConsensusFromLeaves(leaves, fastaMap);
}