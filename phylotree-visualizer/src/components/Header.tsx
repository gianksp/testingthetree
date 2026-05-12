import type { Selection, ParsedTree, TreeNode, VisualizationTab } from "../utils/types";
import TreeSelector from "./TreeSelector";

type HeaderProps = {
  selection: Selection | null;
  allTrees: ParsedTree[];
  treeIdx: number;
  selectTree: (idx: number) => void;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasSelection: boolean;
  nodes: TreeNode[];
  color: string;
  isClade: boolean;
  activeTab: VisualizationTab;
  fitToScreen: () => void;
  setSelection: React.Dispatch<React.SetStateAction<Selection | null>>;
  setFastaPanelLeaf: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Header({
  selection,
  allTrees,
  treeIdx,
  selectTree,
  setMenuOpen,
  hasSelection,
  nodes,
  color,
  isClade,
  activeTab,
  fitToScreen,
  setSelection,
  setFastaPanelLeaf,
}: HeaderProps) {
  return (
    <div className="relative flex items-center px-3 py-2 border-b border-slate-200 bg-white">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          className="text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          ☰
        </button>
      </div>

      {/* Center (true center, independent of sides) */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <TreeSelector
          trees={allTrees}
          selectedIndex={treeIdx}
          onSelect={selectTree}
        />
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">

        {hasSelection && (
          <span
            className="text-xs px-2 py-0.5 rounded border font-medium"
            style={{ borderColor: color, color }}
          >
            {isClade ? "◆" : "●"}{" "}
            {nodes.find(n => n.id === selection?.nodeId)?.name ?? `#${selection?.nodeId}`}
          </span>
        )}

        {hasSelection && (
          <button
            onClick={() => {
              setSelection(null);
              setFastaPanelLeaf(null);
            }}
            className="text-sm hover:opacity-70 transition cursor-pointer"
            style={{ color }}
          >
            ✕
          </button>
        )}

        {activeTab === "tree" && (
          <button
            onClick={fitToScreen}
            aria-label="Fit"
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            ⊡
          </button>
        )}
      </div>
    </div>
  );
};