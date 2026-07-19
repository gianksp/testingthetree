import { useState } from "react";
import hero from "../assets/hero.jpg";

const SPECIES: { display: string; key: string }[] = [
  { display: "Brassica rapa", key: "brassicarapa" },
  { display: "Nasturtium", key: "nasturtium" },
  { display: "Pumpkin", key: "pumpkin" },
  { display: "Mung bean", key: "mungbean" },
  { display: "Hemp", key: "hemp" },
  { display: "Sesame", key: "sesame" },
  { display: "Castor Bean", key: "castorbean" },
  { display: "Cotton", key: "cotton" },
  { display: "Abutilon", key: "abutilon" },
  { display: "Tomato", key: "tomato" },
  { display: "Potato", key: "potato" },
  { display: "Box Elder", key: "boxelder" },
  { display: "Nigella", key: "nigella" },
  { display: "Niger", key: "niger" },
  { display: "Sunflower", key: "sunflower" },
  { display: "Parsnip", key: "parsnip" },
  { display: "Buckwheat", key: "buckwheat" },
  { display: "Spinach", key: "spinach" },
  { display: "Rice", key: "rice" },
  { display: "Wheat", key: "wheat" },
  { display: "Leek", key: "leek" },
  { display: "Arum", key: "arum" },
  { display: "Maize", key: "maize" },
  { display: "Ginkgo", key: "ginkgo" },
];

// Picks up any image dropped in src/assets whose filename (minus extension)
// matches a species key above, regardless of extension. Missing files just
// fall back to the leaf icon below — nothing breaks if a photo is absent.
const speciesImageModules = import.meta.glob<string>(
  "../assets/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const speciesImageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(speciesImageModules)) {
  const base = path.split("/").pop()?.replace(/\.[^.]+$/, "");
  if (base) speciesImageMap[base] = url;
}

interface IntroScreenProps {
  onFinish: () => void;
}

export default function IntroScreen({ onFinish }: IntroScreenProps) {
  const [step, setStep] = useState(0);
  const last = step === 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 ? (
            <>
              <img
                src={hero}
                alt="Cytochrome c protein structure"
                className="mx-auto mb-4 h-40 w-40 object-contain"
              />
              <h2 className="mb-2 text-center text-lg font-bold text-slate-900">
                Meet cytochrome c
              </h2>
              <p className="text-center text-sm leading-relaxed text-slate-600">
                Cytochrome c is a small protein (about 114 amino acids) found in nearly
                every plant and animal. It plays a critical role in cellular respiration,
                shuttling electrons inside mitochondria. Because it's essential and
                changes slowly over time, scientists compare its sequence across species
                to work out how those species are related.
              </p>
            </>
          ) : step === 1 ? (
            <>
              <h2 className="mb-2 text-center text-lg font-bold text-slate-900">
                24 plant species, one protein
              </h2>
              <p className="mb-4 text-center text-sm leading-relaxed text-slate-600">
                This tool compares real cytochrome c sequences from the species below
                (Ginkgo is used as the outgroup) to build a phylogenetic tree — a diagram
                of how they likely evolved from a common ancestor.
              </p>
              <div className="mb-4 grid grid-cols-4 gap-2">
                {SPECIES.map(({ display, key }) => {
                  const img = speciesImageMap[key];
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5"
                    >
                      <div className="flex h-14 w-full items-center justify-center overflow-hidden rounded-md bg-slate-100">
                        {img ? (
                          <img src={img} alt={display} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">🌿</span>
                        )}
                      </div>
                      <span className="w-full truncate text-center text-[9px] text-slate-700">
                        {display}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-slate-600">
                These are real trees, proposed from real sequence data — not simplified
                for this tool. The same sequences can support more than one tree,
                depending on the assumptions used to build it. That's what you're about
                to explore.
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-center text-lg font-bold text-slate-900">
                Same data, two different trees
              </h2>
              <p className="mb-4 text-center text-sm leading-relaxed text-slate-600">
                Here's a simplified example with four species. Both trees below use the
                exact same data — only the assumption about how to weigh one uncertain
                grouping changes. Look at where <strong>B</strong> ends up:
              </p>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <svg viewBox="0 0 120 78" className="mx-auto w-full max-w-[140px]">
                    {/* (A,B) , (C,D) */}
                    <line x1={30} y1={20} x2={30} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={30} y1={38} x2={15} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={15} y1={38} x2={15} y2={58} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={30} y1={38} x2={45} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={45} y1={38} x2={45} y2={58} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={30} y1={20} x2={90} y2={20} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={90} y1={20} x2={90} y2={38} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={90} y1={38} x2={75} y2={38} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={75} y1={38} x2={75} y2={58} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={90} y1={38} x2={105} y2={38} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={105} y1={38} x2={105} y2={58} stroke="#94a3b8" strokeWidth={1.5} />
                    <text x={15} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={700}>A</text>
                    <text x={45} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={700}>B</text>
                    <text x={75} y={70} textAnchor="middle" fontSize={9} fill="#64748b">C</text>
                    <text x={105} y={70} textAnchor="middle" fontSize={9} fill="#64748b">D</text>
                  </svg>
                  <p className="mt-1 text-center text-[10px] font-semibold text-slate-500">Tree 1</p>
                  <p className="text-center text-[10px] text-slate-500">B groups with A</p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <svg viewBox="0 0 120 78" className="mx-auto w-full max-w-[140px]">
                    {/* A, (B,(C,D)) */}
                    <line x1={15} y1={58} x2={15} y2={20} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={15} y1={20} x2={31} y2={20} stroke="#94a3b8" strokeWidth={1.5} />
                    <line x1={31} y1={20} x2={31} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={31} y1={38} x2={45} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={45} y1={38} x2={45} y2={58} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={31} y1={38} x2={68} y2={38} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={68} y1={38} x2={68} y2={48} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={68} y1={48} x2={75} y2={48} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={75} y1={48} x2={75} y2={58} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={68} y1={48} x2={105} y2={48} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={105} y1={48} x2={105} y2={58} stroke="#f59e0b" strokeWidth={2} />
                    <text x={15} y={70} textAnchor="middle" fontSize={9} fill="#64748b">A</text>
                    <text x={45} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={700}>B</text>
                    <text x={75} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={700}>C</text>
                    <text x={105} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={700}>D</text>
                  </svg>
                  <p className="mt-1 text-center text-[10px] font-semibold text-slate-500">Tree 2</p>
                  <p className="text-center text-[10px] text-slate-500">B groups with C, D instead</p>
                </div>
              </div>

              <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                Real trees have this same kind of uncertainty, just across many more
                species and many more branches at once. The tool has 250 candidate
                trees built from the actual plant sequences — use the selector at the
                top of the screen to switch between them and see which branches move.
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-3">
          <button
            onClick={onFinish}
            className="cursor-pointer text-xs text-slate-400 transition hover:text-slate-600"
          >
            Skip intro
          </button>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === step ? "bg-slate-800" : "bg-slate-300"}`}
              />
            ))}
          </div>
          <button
            onClick={() => (last ? onFinish() : setStep((s) => s + 1))}
            className="cursor-pointer rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
          >
            {last ? "Explore the tree →" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
