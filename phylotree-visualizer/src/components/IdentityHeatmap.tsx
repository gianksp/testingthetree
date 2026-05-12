import type { CSSProperties, FC } from "react";
import type { FastaMap, TreeNode } from "../utils/types";
import { identityColor, s } from "../utils/styles";
import { seqIdentity } from "../utils/parser";


export const IdentityHeatmap: FC<{ leafNodes: TreeNode[]; fastaMap: FastaMap }> = ({ leafNodes, fastaMap }) => {
  const labels = leafNodes.map(n => n.name);
  const seqs = leafNodes.map(n => fastaMap[n.name] ?? "");
  const n = labels.length;
  const CELL = Math.min(36, Math.floor(340 / Math.max(n, 1))); const LW = 80;
  return (
    <div style={s.vizPanel}>
      <div style={s.vizTitle}>Pairwise Sequence Identity</div>
      <div style={s.vizDesc}>Higher = more similar. Closely related taxa should cluster with high identity.</div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
        <svg width={LW + n * CELL + 8} height={LW + n * CELL + 8}>
          {labels.map((l, j) => <text key={j} x={LW + j * CELL + CELL / 2} y={LW - 4} textAnchor="end" fontSize={9} fill="#94a3b8" fontFamily="monospace" transform={`rotate(-45,${LW + j * CELL + CELL / 2},${LW - 4})`}>{l}</text>)}
          {labels.map((l, i) => <text key={i} x={LW - 4} y={LW + i * CELL + CELL / 2 + 3} textAnchor="end" fontSize={9} fill="#94a3b8" fontFamily="monospace">{l}</text>)}
          {labels.map((_, i) => labels.map((__, j) => {
            const val = i === j ? 1 : seqIdentity(seqs[i], seqs[j]);
            return <g key={`${i}-${j}`}>
              <rect x={LW + j * CELL} y={LW + i * CELL} width={CELL} height={CELL} fill={identityColor(val)} />
              {CELL >= 22 && <text x={LW + j * CELL + CELL / 2} y={LW + i * CELL + CELL / 2 + 3} textAnchor="middle" fontSize={7} fill="#fff" fontFamily="monospace">{Math.round(val * 100)}</text>}
            </g>;
          }))}
        </svg>
      </div>
    </div>
  );
};
