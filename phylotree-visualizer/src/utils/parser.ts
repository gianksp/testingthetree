
// ══════════════════════════════════════════════════════════════════════════════
// Parsers

import type { BranchRow, FastaMap, ParsedTree, TreeNode } from "./types";

// ══════════════════════════════════════════════════════════════════════════════
export function parseNewick(str: string): TreeNode {
  const s = str.trim().replace(/;$/, "");
  let i = 0; let id = 0;
  function parseNode(): TreeNode {
    const node: TreeNode = { id: id++, children: [], name: "", length: null, collapsed: false, x: 0, y: 0, leafSpan: 1 };
    if (s[i] === "(") {
      i++;
      node.children.push(parseNode());
      while (s[i] === ",") { i++; node.children.push(parseNode()); }
      if (s[i] === ")") i++;
    }
    let name = "";
    while (i < s.length && !/[,):@\[]/.test(s[i])) name += s[i++];
    node.name = name.trim();
    if (s[i] === "[") {
      i++; let comment = "";
      while (i < s.length && s[i] !== "]") comment += s[i++];
      if (s[i] === "]") i++;
      const m = comment.match(/(\d+(?:\.\d+)?)/);
      if (m) node.support = parseFloat(m[1]);
    }
    if (!node.support && node.name && /^\d+(\.\d+)?$/.test(node.name) && node.children.length > 0) {
      node.support = parseFloat(node.name); node.name = "";
    }
    if (s[i] === ":") {
      i++; let len = "";
      while (i < s.length && !/[,);]/.test(s[i])) len += s[i++];
      node.length = parseFloat(len) || 0;
    }
    return node;
  }
  return parseNode();
}

export function parseTreFile(text: string): ParsedTree[] {
  const trees: ParsedTree[] = [];
  if (/begin\s+trees/i.test(text)) {
    const transMap: Record<string, string> = {};
    const transBlock = text.match(/translate\s+([\s\S]+?);/i);
    if (transBlock) {
      for (const e of transBlock[1].trim().split(",")) {
        const parts = e.trim().split(/\s+/);
        if (parts.length >= 2) transMap[parts[0]] = parts[1].replace(/[']/g, "");
      }
    }
    const treeLines = [...text.matchAll(/tree\s+(\S+)\s*(?:\[([^\]]*)\])?\s*=\s*(?:\[&[^\]]*\])?\s*([^;]+;)/gi)];
    for (const m of treeLines) {
      let newick = m[3].trim();
      if (Object.keys(transMap).length > 0)
        newick = newick.replace(/(\d+)/g, (match) => transMap[match] ?? match);
      const scoreMatch = m[2]?.match(/score\s*=\s*([\d.]+)/i) ?? newick.match(/\[!([\d.]+)\]/);
      trees.push({ name: m[1], newick, score: scoreMatch?.[1] });
    }
  }
  if (trees.length === 0) {
    const chunks = text.split(";").map(s => s.trim()).filter(s => s.startsWith("("));
    chunks.forEach((c, i) => trees.push({ name: `Tree ${i + 1}`, newick: c + ";" }));
  }
  return trees;
}

export function parseFasta(text: string): FastaMap {
  const map: FastaMap = {}; let cur: string | null = null;
  for (const line of text.split("\n")) {
    const l = line.trim();
    if (!l) continue;
    if (l.startsWith(">")) { cur = l.slice(1).split(/\s/)[0]; map[cur] = ""; }
    else if (cur) map[cur] += l;
  }
  return map;
}

// ══════════════════════════════════════════════════════════════════════════════
// Layout helpers
// ══════════════════════════════════════════════════════════════════════════════
export function countLeaves(n: TreeNode): number {
  if (!n.children.length || n.collapsed) return 1;
  return n.children.reduce((s, c) => s + countLeaves(c), 0);
}
export function assignLayout(n: TreeNode, depth: number, startY: number): number {
  n.x = depth;
  if (!n.children.length || n.collapsed) { n.y = startY + 0.5; n.leafSpan = 1; return startY + 1; }
  n.leafSpan = countLeaves(n);
  let y = startY;
  for (const c of n.children) y = assignLayout(c, depth + 1, y);
  n.y = n.children.reduce((s, c) => s + c.y, 0) / n.children.length;
  return y;
}
export function collectNodes(n: TreeNode, arr: TreeNode[] = []): TreeNode[] {
  arr.push(n); if (!n.collapsed) n.children.forEach(c => collectNodes(c, arr)); return arr;
}
export function collectEdges(n: TreeNode, arr: { parent: TreeNode; child: TreeNode }[] = []) {
  if (!n.collapsed) for (const c of n.children) { arr.push({ parent: n, child: c }); collectEdges(c, arr); }
  return arr;
}
export function getMaxDepth(n: TreeNode, d = 0): number {
  if (!n.children.length || n.collapsed) return d;
  return Math.max(...n.children.map(c => getMaxDepth(c, d + 1)));
}
export function buildParentMap(n: TreeNode, map: Map<number, TreeNode> = new Map()): Map<number, TreeNode> {
  for (const c of n.children) { map.set(c.id, n); buildParentMap(c, map); } return map;
}
export function getAncestorIds(nodeId: number, pm: Map<number, TreeNode>): Set<number> {
  const ids = new Set<number>(); let cur: number | undefined = nodeId;
  while (cur !== undefined) { ids.add(cur); cur = pm.get(cur)?.id; } return ids;
}
export function getDescendantIds(node: TreeNode): Set<number> {
  const ids = new Set<number>();
  function walk(n: TreeNode) { ids.add(n.id); n.children.forEach(walk); }
  walk(node); return ids;
}
export function findNode(root: TreeNode, id: number): TreeNode | null {
  if (root.id === id) return root;
  for (const c of root.children) { const r = findNode(c, id); if (r) return r; } return null;
}

// ══════════════════════════════════════════════════════════════════════════════
// Sequence analysis
// ══════════════════════════════════════════════════════════════════════════════
export function seqIdentity(a: string, b: string): number {
  if (!a.length || !b.length) return 0;
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) matches++;
  return matches / Math.max(a.length, b.length);
}
export function seqDistance(a: string, b: string): number { return 1 - seqIdentity(a, b); }
export function conservationPerColumn(seqs: string[], maxLen: number): number[] {
  return Array.from({ length: maxLen }, (_, col) => {
    const chars = seqs.map(s => s[col] ?? "-").filter(c => c !== "-" && c !== ".");
    if (!chars.length) return 0;
    const freq: Record<string, number> = {};
    for (const c of chars) freq[c] = (freq[c] ?? 0) + 1;
    return Math.max(...Object.values(freq)) / chars.length;
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// Tree statistics helpers
// ══════════════════════════════════════════════════════════════════════════════

export function collectBranchRows(root: TreeNode): BranchRow[] {
  const rows: BranchRow[] = [];
  function walk(n: TreeNode, parent: TreeNode | null, pathSoFar: number) {
    const len = n.length ?? 0; const path = pathSoFar + len;
    if (parent !== null) rows.push({ nodeLabel: n.name || `node ${n.id}`, isLeaf: n.children.length === 0, parentLabel: parent.name || `node ${parent.id}`, length: len, support: n.support, pathFromRoot: path });
    for (const c of n.children) walk(c, n, path);
  }
  walk(root, null, 0); return rows;
}
export function treeLength(rows: BranchRow[]): number { return rows.reduce((s, r) => s + r.length, 0); }
export function computeSeqCI(seqs: string[], maxLen: number): number | null {
  if (seqs.length < 2 || maxLen === 0) return null;
  let minChanges = 0; let obsChanges = 0;
  for (let col = 0; col < maxLen; col++) {
    const chars = seqs.map(s => s[col] ?? "-").filter(c => c !== "-");
    if (chars.length < 2) continue;
    const unique = new Set(chars).size;
    if (unique > 1) { minChanges += 1; obsChanges += unique - 1; }
  }
  if (obsChanges === 0) return null;
  return minChanges / obsChanges;
}
export function patristicDistance(root: TreeNode, aId: number, bId: number): number {
  function pathToNode(n: TreeNode, target: number, acc: number): number | null {
    if (n.id === target) return acc;
    for (const c of n.children) { const r = pathToNode(c, target, acc + (c.length ?? 0)); if (r !== null) return r; }
    return null;
  }
  function mrca(n: TreeNode, aId: number, bId: number): TreeNode | null {
    const hasA = (function has(x: TreeNode): boolean { if (x.id === aId) return true; return x.children.some(has); })(n);
    const hasB = (function has(x: TreeNode): boolean { if (x.id === bId) return true; return x.children.some(has); })(n);
    if (!hasA || !hasB) return null;
    for (const c of n.children) { const r = mrca(c, aId, bId); if (r) return r; }
    return n;
  }
  const ancestor = mrca(root, aId, bId); if (!ancestor) return 0;
  return (pathToNode(ancestor, aId, 0) ?? 0) + (pathToNode(ancestor, bId, 0) ?? 0);
}
