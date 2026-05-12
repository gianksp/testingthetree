export interface TreeNode {
  id: number; name: string; length: number | null;
  collapsed: boolean; children: TreeNode[];
  x: number; y: number; leafSpan: number;
  support?: number;
}
export interface ParsedTree { name: string; newick: string; score?: string; }
export interface Transform { x: number; y: number; scale: number; }
export type FastaMap = Record<string, string>;
export type SelectionMode = "ancestry" | "clade";
export interface Selection { nodeId: number; mode: SelectionMode; }
export type VisualizationTab = "tree" | "heatmap" | "conservation" | "scatter" | "stats";
export interface Tooltip { x: number; y: number; char: string; pos: number; taxon: string; }
export interface PhyloTreeProps { newick?: string; fasta?: string; className?: string; }
export interface BranchRow {
  nodeLabel: string; isLeaf: boolean; parentLabel: string;
  length: number; support?: number; pathFromRoot: number;
}
export interface FastaPanelProps { name: string; seq: string; onClose: () => void; }