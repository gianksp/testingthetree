import type { CSSProperties, FC } from "react";
import type { FastaMap, TreeNode } from "../utils/types";
import { conservationPerColumn } from "../utils/parser";
import { conservationColor, s } from "../utils/styles";

export const ConservationTrack: FC<{ leafNodes: TreeNode[]; fastaMap: FastaMap; maxLen: number }> = ({ leafNodes, fastaMap, maxLen }) => {
  const seqs = leafNodes.map(n => fastaMap[n.name] ?? "");
  const cons = conservationPerColumn(seqs, maxLen);
  const W = 11; const H = 80; const displayLen = Math.min(maxLen, 200);
  return (
    <div style={s.vizPanel}>
      <div style={s.vizTitle}>Per-Column Conservation</div>
      <div style={s.vizDesc}>Height = fraction sharing the consensus residue. Low bars = variable sites.</div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
        <svg width={displayLen * W + 60} height={H + 40}>
          {[0, 0.5, 1].map(v => <g key={v}>
            <line x1={40} y1={H - v * H + 4} x2={displayLen * W + 48} y2={H - v * H + 4} stroke="#0f2133" strokeWidth={1} />
            <text x={36} y={H - v * H + 7} textAnchor="end" fontSize={8} fill="#475569" fontFamily="monospace">{Math.round(v * 100)}%</text>
          </g>)}
          {cons.slice(0, displayLen).map((v, i) => <g key={i}>
            <rect x={42 + i * W} y={H - Math.max(1, v * H) + 4} width={W - 1} height={Math.max(1, v * H)} fill={conservationColor(v)} rx={1} />
            {i % 10 === 0 && <text x={42 + i * W + W / 2} y={H + 16} textAnchor="middle" fontSize={7} fill="#334155" fontFamily="monospace">{i + 1}</text>}
          </g>)}
        </svg>
      </div>
    </div>
  );
};
