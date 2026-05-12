import type { FC } from "react";
import { AA_COLOR_LEGEND } from "../utils/styles";

export const ColorLegend: FC = () => {
  return (
    <div className="w-full border-t border-slate-200 bg-white px-4 py-2">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Amino Acid Legend
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {AA_COLOR_LEGEND.map((item) => (
          <div
            key={item.code}
            className="flex min-w-0 items-center gap-2 text-[11px] text-slate-700"
          >
            <span className="w-4 shrink-0 font-semibold text-slate-900">
              {item.code}
            </span>
            <span className={`h-2.5 w-6 shrink-0 rounded-sm ${item.swatchClass}`} />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};