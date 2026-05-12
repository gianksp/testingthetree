import { useMemo, type CSSProperties, type FC } from "react";
import type { FastaMap, TreeNode } from "../utils/types";
import { seqDistance } from "../utils/parser";
import { s } from "../utils/styles";

export const DistanceScatter: FC<{ leafNodes: TreeNode[]; fastaMap: FastaMap }> = ({ leafNodes, fastaMap }) => {
  const points = useMemo(() => {
    const pts: { seqDist: number; branchDiff: number; labelA: string; labelB: string }[] = [];
    for (let i = 0; i < leafNodes.length; i++)
      for (let j = i + 1; j < leafNodes.length; j++) {
        pts.push({ seqDist: seqDistance(fastaMap[leafNodes[i].name] ?? "", fastaMap[leafNodes[j].name] ?? ""), branchDiff: Math.abs(leafNodes[i].y - leafNodes[j].y) / Math.max(leafNodes.length, 1), labelA: leafNodes[i].name, labelB: leafNodes[j].name });
      }
    return pts;
  }, [leafNodes, fastaMap]);
  const W = 280; const H = 220; const PAD = 40;
  const maxX = Math.max(...points.map(p => p.branchDiff), 0.01);
  const maxY = Math.max(...points.map(p => p.seqDist), 0.01);
  return (
    <div style={s.vizPanel}>
      <div style={s.vizTitle}>Sequence vs. Tree Distance</div>
      <div style={s.vizDesc}>Pairs should trend diagonally. Outliers = topology/sequence conflict.</div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
        <svg width={W + PAD * 2} height={H + PAD * 2}>
          <line x1={PAD} y1={PAD} x2={PAD} y2={H + PAD} stroke="#1e3a5f" strokeWidth={1.5} />
          <line x1={PAD} y1={H + PAD} x2={W + PAD} y2={H + PAD} stroke="#1e3a5f" strokeWidth={1.5} />
          <text x={PAD + W / 2} y={H + PAD + 22} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="monospace">Tree distance</text>
          <text x={12} y={PAD + H / 2} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="monospace" transform={`rotate(-90,12,${PAD + H / 2})`}>Seq distance</text>
          {(() => {
            const n = points.length; if (n < 2) return null;
            const mx = points.reduce((sum, p) => sum + p.branchDiff, 0) / n;
            const my = points.reduce((sum, p) => sum + p.seqDist, 0) / n;
            const slope = points.reduce((sum, p) => sum + (p.branchDiff - mx) * (p.seqDist - my), 0) / points.reduce((sum, p) => sum + (p.branchDiff - mx) ** 2, 0.0001);
            const b = my - slope * mx;
            return <line x1={PAD} y1={PAD + H - (b / maxY) * H} x2={PAD + W} y2={PAD + H - ((slope * maxX + b) / maxY) * H} stroke="#00e5b033" strokeWidth={1.5} strokeDasharray="4,3" />;
          })()}
          {points.map((p, i) => <circle key={i} cx={PAD + (p.branchDiff / maxX) * W} cy={PAD + H - (p.seqDist / maxY) * H} r={4} fill="#6366f155" stroke="#6366f1" strokeWidth={1}><title>{p.labelA} ↔ {p.labelB}</title></circle>)}
          {[0, 0.5, 1].map(v => <g key={v}>
            <text x={PAD + v * W} y={H + PAD + 10} textAnchor="middle" fontSize={7} fill="#334155" fontFamily="monospace">{(v * maxX).toFixed(2)}</text>
            <text x={PAD - 4} y={PAD + H - v * H + 3} textAnchor="end" fontSize={7} fill="#334155" fontFamily="monospace">{(v * maxY).toFixed(2)}</text>
          </g>)}
        </svg>
      </div>
    </div>
  );
};
