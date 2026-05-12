import { useState, useEffect } from "react";
import type { FastaMap, ParsedTree, Selection, TreeNode } from "../utils/types";
import { parseFasta, parseNewick, parseTreFile } from "../utils/parser";

interface UseTreeStateProps {
    newickProp?: string;
    fastaProp?: string;
}

export function useTreeState({ newickProp, fastaProp }: UseTreeStateProps) {
    const [newickText, setNewickText] = useState<string | undefined>(newickProp);
    const [fastaText, setFastaText] = useState<string | undefined>(fastaProp);
    const [allTrees, setAllTrees] = useState<ParsedTree[]>([]);
    const [treeIdx, setTreeIdx] = useState(0);
    const [tree, setTree] = useState<TreeNode | null>(null);
    const [fastaMap, setFastaMap] = useState<FastaMap>({});
    const [selection, setSelection] = useState<Selection | null>(null);
    const [fastaPanelLeaf, setFastaPanelLeaf] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (newickProp) setNewickText(newickProp);
        if (fastaProp) setFastaText(fastaProp);
    }, [newickProp, fastaProp]);

    useEffect(() => {
        handleBuild();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleBuild(nwk = newickText, fasta = fastaText) {
        try {
            if (!nwk) return;
            const trees = parseTreFile(nwk);
            if (!trees.length) throw new Error("No trees found");
            setAllTrees(trees);
            setTreeIdx(0);
            setTree(parseNewick(trees[0].newick));
            if (fasta) setFastaMap(parseFasta(fasta));
            setSelection(null);
            setFastaPanelLeaf(null);
            setError("");
        } catch (e) {
            setError((e as Error).message);
        }
    }

    function selectTree(idx: number) {
        setTreeIdx(idx);
        try {
            setTree(parseNewick(allTrees[idx].newick));
            setSelection(null);
            setFastaPanelLeaf(null);
        } catch (e) {
            setError((e as Error).message);
        }
    }

    function handleNodeClick(node: TreeNode) {
        if (selection?.nodeId === node.id) {
            setSelection(null);
            setFastaPanelLeaf(null);
            return;
        }
        setSelection({ nodeId: node.id, mode: "clade" });
    }

    function toggleCollapse(nodeId: number) {
        if (!tree) return;

        function toggle(n: TreeNode) {
            if (n.id === nodeId) {
                n.collapsed = !n.collapsed;
                return;
            }
            n.children.forEach(toggle);
        }

        const clone: TreeNode = JSON.parse(JSON.stringify(tree));
        toggle(clone);
        setTree(clone);
        setSelection(null);
        setFastaPanelLeaf(null);
    }

    return {
        newickText,
        setNewickText,
        fastaText,
        setFastaText,
        allTrees,
        treeIdx,
        tree,
        fastaMap,
        selection,
        setSelection,
        fastaPanelLeaf,
        setFastaPanelLeaf,
        error,
        handleBuild,
        selectTree,
        handleNodeClick,
        toggleCollapse,
    };
}