import { AA_COLORS, AA_COLOR_LEGEND } from "../utils/styles";
import type { Tooltip } from "../utils/types";

interface ResidueTooltipProps {
    tooltip: Tooltip;
}

export function ResidueTooltip({ tooltip }: ResidueTooltipProps) {
    return (
        <div
            className="pointer-events-none absolute z-20 rounded-lg border border-slate-200 bg-white/95 px-2 py-1 shadow-sm backdrop-blur"
            style={{ left: tooltip.x + 8, top: tooltip.y }}
        >
            <span
                className="text-sm font-bold"
                style={{ color: AA_COLORS[tooltip.char.toUpperCase()] ?? "#111827" }}
            >
                {tooltip.char}
            </span>
            <span className="ml-1 text-[10px] text-slate-500">pos {tooltip.pos}</span>
            <div className="text-[10px] text-slate-600">
                {AA_COLOR_LEGEND?.find((el) => el.code === tooltip.char.toUpperCase())?.name}
            </div>
        </div>
    );
}