import { useMemo, useState, type FC } from "react";
import type { FastaMap, TreeNode } from "../utils/types";
import { collectBranchRows, computeSeqCI, patristicDistance, treeLength } from "../utils/parser";
import { vstyles } from "../utils/styles";
import { StatCard } from "./StatCard";
import { CardHeader } from "./CardHeader";

export const TreeStats: FC<{ root: TreeNode; leafNodes: TreeNode[]; fastaMap: FastaMap; maxSeqLen: number }> = ({ root, leafNodes, fastaMap, maxSeqLen }) => {
  const [sortCol, setSortCol] = useState<"label" | "length" | "path" | "support">("length");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterLeaves, setFilterLeaves] = useState(false);
  const rows = useMemo(() => collectBranchRows(root), [root]);
  const seqs = leafNodes.map(n => fastaMap[n.name] ?? "");
  const totalLen = treeLength(rows);
  const seqCI = computeSeqCI(seqs, maxSeqLen);
  const seqHI = seqCI !== null ? 1 - seqCI : null;
  const maxBranch = Math.max(...rows.map(r => r.length), 0.001);
  const meanBranch = totalLen / Math.max(rows.length, 1);
  const stdBranch = Math.sqrt(rows.reduce((sum, r) => sum + (r.length - meanBranch) ** 2, 0) / Math.max(rows.length, 1));
  const lbThresh = meanBranch + 2 * stdBranch;
  const patLeaves = leafNodes.slice(0, 12);
  const patMatrix = useMemo(() => patLeaves.map(a => patLeaves.map(b => a.id === b.id ? 0 : patristicDistance(root, a.id, b.id))), [root, patLeaves]);
  const maxPat = Math.max(...patMatrix.flat(), 0.001);
  const sorted = useMemo(() => {
    const filtered = filterLeaves ? rows.filter(r => r.isLeaf) : rows;
    return [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortCol === "label") return dir * a.nodeLabel.localeCompare(b.nodeLabel);
      if (sortCol === "length") return dir * (a.length - b.length);
      if (sortCol === "path") return dir * (a.pathFromRoot - b.pathFromRoot);
      return dir * ((a.support ?? -1) - (b.support ?? -1));
    });
  }, [rows, sortCol, sortDir, filterLeaves]);
  function toggleSort(col: typeof sortCol) { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("desc"); } }
  const SortIcon = ({ col }: { col: typeof sortCol }) => sortCol === col ? <span style={{ color: "#00e5b0", marginLeft: 2 }}>{sortDir === "desc" ? "↓" : "↑"}</span> : <span style={{ color: "#1e3a5f", marginLeft: 2 }}>↕</span>;
  return (
    <div style={vstyles.panel}>
      <div style={vstyles.cards}>
        <StatCard label="Tree length" value={totalLen.toFixed(4)} sub="sum of all branch lengths" />
        <StatCard label="# Branches" value={String(rows.length)} sub={`${leafNodes.length} leaves, ${rows.length - leafNodes.length} internal`} />
        <StatCard label="Mean branch" value={meanBranch.toFixed(4)} sub={`σ = ${stdBranch.toFixed(4)}`} />
        <StatCard label="Max branch" value={maxBranch.toFixed(4)} sub={rows.find(r => r.length === maxBranch)?.nodeLabel ?? ""} warn={maxBranch > lbThresh} />
        {seqCI !== null && <StatCard label="Seq CI proxy" value={seqCI.toFixed(4)} sub="1 = no homoplasy" warn={seqCI < 0.5} good={seqCI >= 0.8} />}
        {seqHI !== null && <StatCard label="Seq HI proxy" value={seqHI.toFixed(4)} sub="1 − CI" warn={seqHI > 0.5} />}
      </div>
      {rows.some(r => r.length > lbThresh) && <div style={vstyles.warning}>⚠ Long branch attraction risk: {rows.filter(r => r.length > lbThresh).map(r => r.nodeLabel).join(", ")} — exceed mean + 2σ ({lbThresh.toFixed(4)})</div>}
      <div style={vstyles.sectionHeader}>
        <span style={vstyles.sectionTitle}>Branch lengths</span>
        <label style={vstyles.filterToggle}><input type="checkbox" checked={filterLeaves} onChange={e => setFilterLeaves(e.target.checked)} style={{ marginRight: 6 }} />Leaves only</label>
      </div>
      <div style={vstyles.tableWrap}>
        <table style={vstyles.table}>
          <thead><tr>
            <CardHeader onClick={() => toggleSort("label")}>Node <SortIcon col="label" /></CardHeader>
            <CardHeader>Parent</CardHeader>
            <CardHeader onClick={() => toggleSort("length")}>Length <SortIcon col="length" /></CardHeader>
            <CardHeader>Bar</CardHeader>
            <CardHeader onClick={() => toggleSort("path")}>Root dist <SortIcon col="path" /></CardHeader>
            <CardHeader onClick={() => toggleSort("support")}>Support <SortIcon col="support" /></CardHeader>
          </tr></thead>
          <tbody>{sorted.map((r, i) => {
            const isLong = r.length > lbThresh;
            return <tr key={i} style={{ background: isLong ? "#3b1a0a" : i % 2 === 0 ? "#0d1929" : "transparent" }}>
              <td style={{ ...vstyles.td, color: r.isLeaf ? "#94a3b8" : "#6366f1" }}>{isLong && <span style={{ color: "#f97316", marginRight: 4 }}>⚠</span>}{r.nodeLabel}</td>
              <td style={{ ...vstyles.td, color: "#475569" }}>{r.parentLabel}</td>
              <td style={{ ...vstyles.td, color: isLong ? "#f97316" : "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>{r.length.toFixed(4)}</td>
              <td style={vstyles.td}><div style={{ width: 80, height: 8, background: "#0f2133", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(r.length / maxBranch) * 100}%`, height: "100%", background: isLong ? "#f97316" : r.isLeaf ? "#00e5b0" : "#6366f1", borderRadius: 4 }} /></div></td>
              <td style={{ ...vstyles.td, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>{r.pathFromRoot.toFixed(4)}</td>
              <td style={{ ...vstyles.td, color: r.support !== undefined ? (r.support >= 95 ? "#00e5b0" : r.support >= 70 ? "#fbbf24" : "#ef4444") : "#1e3a5f" }}>{r.support ?? "—"}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {patLeaves.length >= 2 && <>
        <div style={{ ...vstyles.sectionHeader, marginTop: 24 }}>
          <span style={vstyles.sectionTitle}>Patristic distances</span>
          <span style={vstyles.sectionSub}>{patLeaves.length < leafNodes.length ? `first ${patLeaves.length}` : "all"} leaves</span>
        </div>
        <div style={vstyles.tableWrap}>
          <table style={vstyles.table}>
            <thead><tr><CardHeader> </CardHeader>{patLeaves.map(l => <CardHeader key={l.id}>{l.name}</CardHeader>)}</tr></thead>
            <tbody>{patLeaves.map((rowLeaf, ri) => <tr key={rowLeaf.id}>
              <td style={{ ...vstyles.td, color: "#94a3b8", whiteSpace: "nowrap" }}>{rowLeaf.name}</td>
              {patLeaves.map((colLeaf, ci) => {
                const v = patMatrix[ri][ci]; const intensity = v / maxPat;
                return <td key={colLeaf.id} style={{ ...vstyles.td, background: ri === ci ? "#0f2133" : `rgba(0,${Math.round(180 * (1 - intensity))},${Math.round(229 * (1 - intensity))},${0.15 + intensity * 0.6})`, color: ri === ci ? "#334155" : "#e2e8f0", fontVariantNumeric: "tabular-nums", textAlign: "center" }}>{ri === ci ? "—" : v.toFixed(3)}</td>;
              })}
            </tr>)}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
};
