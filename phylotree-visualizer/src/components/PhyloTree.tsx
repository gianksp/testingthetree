import { useState, useRef, useEffect, useMemo } from "react";
import type { PhyloTreeProps, Tooltip, Transform } from "../utils/types";

import { SideMenu } from "./SideMenu";
import { ColorLegend } from "./ColorLegend";
import { FastaPanel } from "./FastaPanel";
import Header from "./Header";
import { TreeEdges } from "./TreeEdges";
import { TreeNodeItem } from "./TreeNodeItem";
import { SequenceRuler } from "./SequenceRuler";
import { ResidueTooltip } from "./ResidueTooltip";

import { useTreeState } from "../hooks/useTreeState";
import { useCanvasPan } from "../hooks/useCanvasPan";

import { buildGlobalConsensus, buildCladeConsensus } from "../utils/consensus";
import { TREE_CONSTANTS } from "../utils/treeLayout";
import { AA_W_COMPACT, AA_W_EXPANDED } from "../utils/styles";
import {
  assignLayout,
  buildParentMap,
  collectEdges,
  collectNodes,
  countLeaves,
  findNode,
  getAncestorIds,
  getDescendantIds,
  getMaxDepth,
} from "../utils/parser";
import type { TreeNode } from "../utils/types";

const { ROW_H, SEQ_X, CLADE_COLOR } = TREE_CONSTANTS;

export default function PhyloTree({ newick: newickProp, fasta: fastaProp }: PhyloTreeProps) {
  const {
    newickText, setNewickText,
    fastaText, setFastaText,
    allTrees, treeIdx, tree, fastaMap,
    selection, setSelection,
    fastaPanelLeaf, setFastaPanelLeaf,
    error,
    handleBuild, selectTree,
    handleNodeClick, toggleCollapse,
  } = useTreeState({ newickProp, fastaProp });

  const [transform, setTransform] = useState<Transform>({ x: 16, y: 16, scale: 1 });
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [showSupport, setShowSupport] = useState(true);
  const [showBranchLen, setShowBranchLen] = useState(false);
  const [showMutations, setShowMutations] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showSequenceLetter, setShowSequenceLetter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const didAutoFit = useRef(false);

  const { dragging, onWheel, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd } =
    useCanvasPan({ setTransform, canvasRef });

  const layout = useMemo(() => {
    if (!tree) return null;
    const root: TreeNode = JSON.parse(JSON.stringify(tree));
    const leaves = countLeaves(root);
    const maxDepth = getMaxDepth(root);
    assignLayout(root, 0, 0);
    return { root, leaves, maxDepth };
  }, [tree]);

  const residueBoxW = showSequenceLetter ? AA_W_EXPANDED : AA_W_COMPACT;
  const svgHeight = layout ? Math.max(layout.leaves * ROW_H + 20, 200) : 200;

  useEffect(() => {
    if (!layout || !canvasRef.current || didAutoFit.current) return;
    didAutoFit.current = true;
    const canvasH = canvasRef.current.clientHeight;
    const fitScale = Math.min(Math.max((canvasH - 32) / (layout.leaves * ROW_H + 20), 0.2), 3);
    setTransform({ x: 16, y: 16, scale: fitScale });
  }, [layout]);

  useEffect(() => {
    didAutoFit.current = false;
  }, [tree]);

  const ancestorIds = useMemo<Set<number>>(() => {
    if (!layout || !selection) return new Set();
    const ids = getAncestorIds(selection.nodeId, buildParentMap(layout.root));
    ids.add(selection.nodeId);
    return ids;
  }, [layout, selection]);

  const descendantIds = useMemo<Set<number>>(() => {
    if (!layout || !selection) return new Set();
    const node = findNode(layout.root, selection.nodeId);
    if (!node) return new Set();
    const ids = getDescendantIds(node);
    ids.add(selection.nodeId);
    return ids;
  }, [layout, selection]);

  const globalConsensus = useMemo<string>(() => {
    if (!layout) return "";
    return buildGlobalConsensus(layout.root, fastaMap);
  }, [layout, fastaMap]);

  const comparisonConsensus = useMemo<string>(() => {
    if (!showMutations || !selection || !layout) return "";
    return buildCladeConsensus(layout.root, selection.nodeId, fastaMap);
  }, [showMutations, selection, layout, fastaMap]);

  function fitToScreen() {
    if (!layout || !canvasRef.current) return;
    const canvasH = canvasRef.current.clientHeight;
    const fitScale = Math.min(Math.max((canvasH - 32) / (layout.leaves * ROW_H + 20), 0.1), 3);
    setTransform({ x: 16, y: 16, scale: fitScale });
  }

  const sideMenuProps = {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    newickText: newickText ?? "",
    fastaText: fastaText ?? "",
    setNewickText,
    setFastaText,
    onBuild: handleBuild,
    error,
    allTrees,
    treeIdx,
    onSelectTree: selectTree,
    showSupport, setShowSupport,
    showBranchLen, setShowBranchLen,
    showMutations, setShowMutations,
    showLegend, setShowLegend,
    showSequenceLetter, setShowSequenceLetter,
  };

  if (!layout) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
        <Header
          selection={selection}
          allTrees={allTrees}
          treeIdx={treeIdx}
          selectTree={selectTree}
          setMenuOpen={setMenuOpen}
          fitToScreen={fitToScreen}
          setSelection={setSelection}
          setFastaPanelLeaf={setFastaPanelLeaf}
          hasSelection={false}
          nodes={[]}
          color=""
          isClade={false}
          activeTab="tree"
        />
        <SideMenu {...sideMenuProps} />
      </div>
    );
  }

  const { root, maxDepth } = layout;
  const nodes = collectNodes(root);
  const edges = collectEdges(root);
  const leafNodes = nodes.filter((n) => !n.children.length || n.collapsed);
  const maxSeqLen = Math.max(...leafNodes.map((n) => (fastaMap[n.name] ?? "").length), 0);
  const totalSvgW = SEQ_X + maxSeqLen * residueBoxW + 20;
  const hasSelection = selection !== null;

  const activeConsensus = showMutations && comparisonConsensus
    ? comparisonConsensus
    : hasSelection
      ? globalConsensus
      : "";

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      <Header
        selection={selection}
        allTrees={allTrees}
        treeIdx={treeIdx}
        selectTree={selectTree}
        setMenuOpen={setMenuOpen}
        hasSelection={hasSelection}
        nodes={nodes}
        color={CLADE_COLOR}
        isClade={true}
        fitToScreen={fitToScreen}
        setSelection={setSelection}
        setFastaPanelLeaf={setFastaPanelLeaf}
        activeTab="tree"
      />

      <SideMenu {...sideMenuProps} />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            ref={canvasRef}
            className="relative min-h-0 flex-1 overflow-auto bg-white"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <svg
              width={totalSvgW * transform.scale + 60}
              height={svgHeight * transform.scale + 60}
              className="block touch-none"
              style={{ cursor: dragging.current ? "grabbing" : "grab" }}
            >
              <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
                {/* Alternating row backgrounds */}
                {leafNodes.map((n, li) =>
                  li % 2 === 0 ? (
                    <rect
                      key={n.id}
                      x={0}
                      y={n.y * ROW_H + 14 - ROW_H / 2}
                      width={totalSvgW}
                      height={ROW_H}
                      fill="#f8fafc"
                    />
                  ) : null
                )}

                <SequenceRuler maxSeqLen={maxSeqLen} seqX={SEQ_X} residueBoxW={residueBoxW} />

                <TreeEdges
                  edges={edges}
                  maxDepth={maxDepth}
                  hasSelection={hasSelection}
                  ancestorIds={ancestorIds}
                  descendantIds={descendantIds}
                />

                {/* Separator line between tree and sequences */}
                <line
                  x1={SEQ_X - 6}
                  y1={0}
                  x2={SEQ_X - 6}
                  y2={svgHeight + 10}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />

                {nodes.map((node) => (
                  <TreeNodeItem
                    key={node.id}
                    node={node}
                    maxDepth={maxDepth}
                    totalSvgW={totalSvgW}
                    seqX={SEQ_X}
                    maxSeqLen={maxSeqLen}
                    hasSelection={hasSelection}
                    selection={selection}
                    ancestorIds={ancestorIds}
                    descendantIds={descendantIds}
                    activeConsensus={activeConsensus}
                    fastaMap={fastaMap}
                    showSupport={showSupport}
                    showBranchLen={showBranchLen}
                    showSequenceLetter={showSequenceLetter}
                    canvasRef={canvasRef}
                    setTooltip={setTooltip}
                    setFastaPanelLeaf={setFastaPanelLeaf}
                    onNodeClick={handleNodeClick}
                    onToggleCollapse={toggleCollapse}
                  />
                ))}
              </g>
            </svg>

            {tooltip && <ResidueTooltip tooltip={tooltip} />}
          </div>

          {showLegend && <ColorLegend />}

          {fastaPanelLeaf && fastaMap[fastaPanelLeaf] && (
            <FastaPanel
              name={fastaPanelLeaf}
              seq={fastaMap[fastaPanelLeaf]}
              onClose={() => setFastaPanelLeaf(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}