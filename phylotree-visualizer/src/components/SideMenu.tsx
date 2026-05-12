import { type ChangeEvent, type FC } from "react";
import type { ParsedTree } from "../utils/types";

interface SideMenuProps {
    open: boolean;
    onClose: () => void;
    newickText: string;
    setNewickText: (v: string) => void;
    fastaText: string;
    setFastaText: (v: string) => void;
    onBuild: () => void;
    error: string;
    allTrees: ParsedTree[];
    treeIdx: number;
    onSelectTree: (i: number) => void;
    showSupport: boolean;
    setShowSupport: (v: boolean) => void;
    showBranchLen: boolean;
    setShowBranchLen: (v: boolean) => void;
    showMutations: boolean;
    setShowMutations: (v: boolean) => void;
    showLegend: boolean;
    setShowLegend: (v: boolean) => void;
    showSequenceLetter: boolean,
    setShowSequenceLetter: (v: boolean) => void
}

export const SideMenu: FC<SideMenuProps> = ({
    open,
    onClose,
    newickText,
    setNewickText,
    fastaText,
    setFastaText,
    onBuild,
    error,
    showBranchLen,
    setShowBranchLen,
    showLegend,
    setShowLegend,
    showSequenceLetter,
    setShowSequenceLetter
}) => {

    function handleTreFile(e: ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        f.text().then(setNewickText);
    }

    function handleFastaFile(e: ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        f.text().then(setFastaText);
    }

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                />
            )}

            <aside
                className={[
                    "fixed left-0 top-0 z-50 flex h-full w-[min(92vw,420px)] flex-col",
                    "border-r border-slate-200 bg-white shadow-xl",
                    "transition-transform duration-300 ease-out",
                    open ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                    <span className="text-base font-semibold text-slate-900">
                        Edit
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-6">


                        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-sm font-semibold text-slate-900">Tree & Alignment Data</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium text-slate-700">
                                        Paste Tree{" "}
                                        <a
                                            href="https://phylipweb.github.io/phylip/newicktree.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-700"
                                        >
                                            (Newick)
                                        </a>
                                    </span>

                                    <label className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100">
                                        ↑ Upload .tre
                                        <input
                                            type="file"
                                            accept=".tre,.nex,.nwk,.txt"
                                            onChange={handleTreFile}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <textarea
                                    value={newickText}
                                    rows={4}
                                    onChange={(e) => setNewickText(e.target.value)}
                                    placeholder="(B:6.0,(A:5.0,C:3.0,E:4.0):5.0,D:11.0);"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium text-slate-700">
                                        Paste Sequences{" "}
                                        <a
                                            href="https://aideepmed.com/FASTA/#:~:text=FASTA%20format%20is%20a%20text,by%20lines%20of%20sequence%20data."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-700"
                                        >
                                            (FASTA)
                                        </a>
                                    </span>

                                    <label className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100">
                                        ↑ Upload .fasta
                                        <input
                                            type="file"
                                            accept=".fasta,.fa,.fas,.txt"
                                            onChange={handleFastaFile}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <textarea
                                    value={fastaText}
                                    rows={4}
                                    onChange={(e) => setFastaText(e.target.value)}
                                    placeholder={">TaxonName\nSEQUENCE..."}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
                                />
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    onBuild();
                                    onClose();
                                }}
                                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                            >
                                Build Tree →
                            </button>
                        </section>

                        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-sm font-semibold text-slate-900">
                                Display
                            </div>

                            {(
                                [
                                    // ["Bootstrap values", showSupport, setShowSupport],
                                    ["Branch lengths", showBranchLen, setShowBranchLen],
                                    // ["Mutations vs consensus", showMutations, setShowMutations],
                                    
                                    ["Sequence details", showSequenceLetter, setShowSequenceLetter],
                                    ["Color legend", showLegend, setShowLegend],
                                ] as [string, boolean, (v: boolean) => void][]
                            ).map(([label, val, setter]) => (
                                <label
                                    key={label}
                                    className="flex cursor-pointer items-center justify-between gap-3"
                                >
                                    <span className="text-sm text-slate-700">{label}</span>

                                    <button
                                        type="button"
                                        onClick={() => setter(!val)}
                                        aria-pressed={val}
                                        className={[
                                            "relative h-7 w-12 rounded-full transition",
                                            val ? "bg-emerald-400" : "bg-slate-300",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                                                val ? "translate-x-6 left-0" : "translate-x-1 left-0",
                                            ].join(" ")}
                                        />
                                    </button>
                                </label>
                            ))}
                        </section>
                    </div>
                </div>
            </aside>
        </>
    );
};