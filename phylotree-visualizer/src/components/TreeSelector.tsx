import React from 'react';

export type PhylogeneticTree = {
  name: string;
  newick: string;
};

type TreeSelectorProps = {
  trees: PhylogeneticTree[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const TreeSelector: React.FC<TreeSelectorProps> = ({
  trees,
  selectedIndex,
  onSelect,
}) => {
  const hasTrees = trees.length > 0;

  const goPrev = () => {
    if (!hasTrees || selectedIndex <= 0) return;
    onSelect(selectedIndex - 1);
  };

  const goNext = () => {
    if (!hasTrees || selectedIndex >= trees.length - 1) return;
    onSelect(selectedIndex + 1);
  };

  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-slate-100 cursor-auto">

      {/* Prev */}
      <button
        type="button"
        onClick={goPrev}
        disabled={selectedIndex === 0}
        aria-label="Previous tree"
        className="flex h-7 w-7 items-center justify-center rounded-md
          text-slate-500 transition
          hover:bg-slate-100 hover:text-slate-800
          active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.79 15.79a.75.75 0 01-1.06 0L6.47 10.53a.75.75 0 010-1.06l5.26-5.26a.75.75 0 111.06 1.06L8.06 10l4.73 4.73a.75.75 0 010 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Title */}
      <div className="text-md font-medium text-slate-700 whitespace-nowrap">
        Tree
        {trees.length > 1 && (
          <span className="text-slate-500">
            {" "}· {selectedIndex + 1}/{trees.length}
          </span>
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={goNext}
        disabled={selectedIndex === trees.length - 1}
        aria-label="Next tree"
        className="flex h-7 w-7 items-center justify-center rounded-md
          text-slate-500 transition
          hover:bg-slate-100 hover:text-slate-800
          active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.21 4.21a.75.75 0 011.06 0l5.26 5.26a.75.75 0 010 1.06l-5.26 5.26a.75.75 0 11-1.06-1.06L11.94 10 7.21 5.27a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

    </div>
  );
};

export default TreeSelector;