import type { FC } from "react";
import type { FastaPanelProps } from "../utils/types";
import { AA_COLORS } from "../utils/styles";

export const FastaPanel: FC<FastaPanelProps> = ({ name, seq, onClose }) => {
    const lines: string[] = [];
    for (let i = 0; i < seq.length; i += 60) {
        lines.push(seq.slice(i, i + 60));
    }

    return (
        <>
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close FASTA panel"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            />

            {/* Panel */}
            <div
                className="
    fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden
    rounded-t-3xl border-t border-slate-200 bg-white

    md:inset-x-0 md:bottom-0 md:w-full md:max-h-[80vh]
    md:rounded-t-2xl md:border-t md:shadow-none
  "
            >
                {/* Handle on mobile */}
                <div className="flex justify-center py-2 md:hidden">
                    <div className="h-1.5 w-10 rounded-full bg-slate-300" />
                </div>

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-800 md:text-base">
                            &gt;{name}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 md:text-sm">
                            {seq.length} aa
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* Sequence content */}
                <div className="overflow-auto px-3 pb-4 pt-3 md:px-4">
                    <div className="space-y-2 md:space-y-2.5">
                        {lines.map((line, li) => (
                            <div key={li} className="flex items-start gap-2 md:gap-3">
                                {/* Position */}
                                <div className="w-11 shrink-0 pt-1 text-right text-[11px] text-slate-400 md:w-14 md:text-xs">
                                    {li * 60 + 1}
                                </div>

                                {/* Sequence */}
                                <div className="flex flex-1 flex-wrap gap-0.5 md:gap-1">
                                    {line.split("").map((ch, ci) => (
                                        <span
                                            key={ci}
                                            className="
                        inline-flex h-5 min-w-[18px] items-center justify-center rounded
                        px-1 text-[11px] font-mono leading-none text-slate-900
                        md:h-6 md:min-w-[22px] md:px-1.5 md:text-xs text-black font-medium
                      "
                                            style={{
                                                background: AA_COLORS[ch.toUpperCase()] ?? "#e2e8f0",
                                            }}
                                        >

                                            {ch}

                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Raw FASTA */}
                    <div className="mt-4 border-t border-slate-200 pt-3">
                        <div className="mb-2 text-xs font-medium text-slate-500 md:text-sm">
                            FASTA
                        </div>
                        <pre
                            className="
                overflow-x-auto rounded-xl bg-slate-50 p-3 font-mono
                text-[11px] leading-5 text-slate-700
                md:text-xs md:leading-6
              "
                        >
                            {`>${name}
${lines.join("\n")}`}
                        </pre>
                    </div>
                </div>
            </div>
        </>
    );
};