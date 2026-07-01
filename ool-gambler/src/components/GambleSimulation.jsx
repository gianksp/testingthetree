import React, { useEffect, useMemo, useRef, useState } from "react";
import WapperScreen from "./screens/WapperScreen";
import WapperResultModal from "./screens/WapperResultModal";
import Lever from "./screens/Lever";
import LightFrame from "./screens/LightFrame";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function runSimulation({ numEnvs, probs, applyWAPWhenAllFail }) {
  const steps = probs.length;
  const grid = Array.from({ length: steps }, () =>
    Array.from({ length: numEnvs }, () => ({ status: "pending" }))
  );

  let alive = new Set(Array.from({ length: numEnvs }, (_, i) => i));
  let wapFilledEnv = null;

  for (let s = 0; s < steps; s++) {
    if (alive.size === 1) {
      const lone = [...alive][0];
      // Retroactively brand the whole lineage as WAP-preserved, past successes included.
      for (let s2 = 0; s2 < steps; s2++) grid[s2][lone] = { status: "wap" };
      wapFilledEnv = lone;
      break;
    }

    const p = clamp(probs[s], 0, 1);
    const nextAlive = new Set();

    for (const env of alive) {
      const success = Math.random() < p;
      grid[s][env] = { status: success ? "success" : "fail" };
      if (success) nextAlive.add(env);
    }

    if (nextAlive.size === 0) {
      if (applyWAPWhenAllFail) {
        const chosen = Math.floor(Math.random() * numEnvs);
        for (let s2 = 0; s2 < steps; s2++) grid[s2][chosen] = { status: "wap" };
        wapFilledEnv = chosen;
        alive = new Set([chosen]);
        break;
      }

      alive = new Set();
      break;
    }

    alive = nextAlive;
  }

  const survivors = new Set();
  const lastRow = grid[grid.length - 1];
  lastRow.forEach((cell, idx) => {
    if (cell.status === "success" || cell.status === "wap") survivors.add(idx);
  });

  return { grid, survivors: [...survivors], wapFilledEnv };
}

const expectedPerLineage = (probs) =>
  probs.reduce((acc, p) => acc * clamp(p, 0, 1), 1);

function formatProbability(value) {
  if (value === 0) return "0%";
  if (value >= 0.001) return `${(value * 100).toFixed(3)}%`;

  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

function formatExpectedCount(value) {
  if (value === 0) return "0";
  if (value >= 0.001) return value.toFixed(3);

  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

const DEFAULT_STEPS = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

const DEFAULT_STEP_NAMES = [
  "Amino acids form from inorganic chemistry",
  "Nucleotides assemble from simpler molecules",
  "Monomers concentrate in a local environment",
  "Monomers polymerize into chains without enzymes",
  "A molecule emerges that copies itself",
  "Copies vary and those differences are inherited",
  "A membrane forms that encloses the chemistry",
  "Replication and membrane division become coupled",
  "A code linking nucleotides to amino acids emerges",
  "Machinery that reads the code and builds proteins appears",
];

const ROW_REVEAL_MS = 450;

function emptyGrid(steps, numEnvs) {
  return Array.from({ length: steps }, () =>
    Array.from({ length: numEnvs }, () => ({ status: "pending" }))
  );
}

function SectionCard({ className = "", children }) {
  return (
    <div
      className={`rounded-3xl border border-yellow-500/15 bg-white/[0.04] shadow-[0_0_30px_rgba(0,0,0,0.4)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function GuideStrip({ active }) {
  const steps = [
    { key: "odds", label: "Set the odds" },
    { key: "run", label: "Pull the lever" },
    { key: "see", label: "See who survives" },
  ];

  return (
    <div className="flex flex-nowrap items-center gap-1 overflow-x-auto text-[10px] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:text-sm [&::-webkit-scrollbar]:hidden">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 font-semibold transition sm:gap-2 sm:px-3 sm:py-1.5 ${active === s.key
                ? "border-yellow-400 bg-yellow-400/15 text-yellow-300"
                : "border-slate-700 bg-white/[0.03] text-slate-400"
              }`}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/40 text-[9px] sm:h-5 sm:w-5 sm:text-[11px]">
              {i + 1}
            </span>
            {s.label}
          </div>
          {i < steps.length - 1 && <span className="shrink-0 text-slate-600">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <SectionCard className="p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-sm leading-6 text-slate-400">{hint}</div>
    </SectionCard>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
        <span className="font-bold">✓</span>
        <span>survived</span>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-red-300">
        <span className="font-bold">X</span>
        <span>died</span>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-yellow-400/60 bg-yellow-400/10 px-3 py-1.5 text-yellow-300">
        <span className="font-bold">☘</span>
        <span>saved by fallback</span>
      </div>
    </div>
  );
}

function ConfigDrawer({ open, onClose, onRun, children }) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 w-full max-h-[90vh] overflow-y-auto rounded-t-3xl border-t border-yellow-500/30 bg-black p-4 shadow-2xl transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700" />

        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Set the odds</h2>
            <p className="text-sm text-slate-400">Defaults are already playable — tweak anything you like.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRun}
              className="rounded-2xl bg-yellow-400 px-3 py-2 text-sm font-bold text-black active:bg-yellow-300"
            >
              Pull lever
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300"
            >
              Done
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

function ProbabilityEditor({ probs, setProbs, stepNames, setStepNames }) {
  const displayOrder = Array.from({ length: probs.length }, (_, i) => probs.length - 1 - i);

  return (
    <div className="space-y-4">
      {displayOrder.map((rowIdx) => (
        <div key={rowIdx} className="rounded-2xl border border-slate-700 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={stepNames[rowIdx] ?? ""}
                onChange={(e) => {
                  const next = [...stepNames];
                  next[rowIdx] = e.target.value;
                  setStepNames(next);
                }}
                placeholder={`Step ${rowIdx + 1}`}
                className="w-full border-b border-transparent bg-transparent text-sm font-medium text-white outline-none focus:border-yellow-400"
              />
              <div className="mt-1 text-xs text-slate-500">How likely this step is to succeed</div>
            </div>
            <div className="shrink-0 rounded-xl bg-black px-2.5 py-1 text-sm font-semibold text-yellow-300 ring-1 ring-slate-700">
              {Math.round(probs[rowIdx] * 100)}%
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={probs[rowIdx]}
            onChange={(e) => {
              const next = [...probs];
              next[rowIdx] = Number(Number(e.target.value).toFixed(2));
              setProbs(next);
            }}
            className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-yellow-400"
          />
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wide text-slate-500">
            <span>never</span>
            <span>50 / 50</span>
            <span>always</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Controls({
  compact = false,
  numEnvs,
  setNumEnvs,
  steps,
  adjustSteps,
  applyWAPWhenAllFail,
  setApplyWAPWhenAllFail,
  randomizeProbs,
  resetProbs,
  handleRun,
  handleClear,
  probs,
  setProbs,
  stepNames,
  setStepNames,
  disabled,
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <SectionCard className={compact ? "p-3" : "p-4"}>
        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Environments to test
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={numEnvs}
              disabled={disabled}
              onChange={(e) => setNumEnvs(clamp(parseInt(e.target.value || "1", 10), 1, 50))}
              className="w-full rounded-2xl border border-slate-700 bg-black/40 px-3 py-2.5 text-white outline-none transition focus:border-yellow-400 disabled:opacity-50"
            />
            <div className="mt-1 text-xs text-slate-500">
              Think of these as parallel worlds running the same gauntlet. 1 to 50.
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Steps in the chain</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => adjustSteps(-1)}
                className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
              >
                - step
              </button>
              <div className="min-w-24 rounded-2xl bg-white/[0.04] px-4 py-2.5 text-center text-sm font-semibold text-slate-200">
                {steps} total
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => adjustSteps(1)}
                className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
              >
                + step
              </button>
            </div>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-700 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={applyWAPWhenAllFail}
            disabled={disabled}
            onChange={(e) => setApplyWAPWhenAllFail(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-600 text-yellow-400 focus:ring-yellow-400"
          />
          <div>
            <div className="text-sm font-medium text-white">
              If everything dies, hand someone the trophy anyway
            </div>
            <div className="mt-1 text-sm text-slate-400">
              This is exactly what the WAPPER jokes about: when every environment fails, one gets
              picked after the fact and counted as a survivor. Turn it off to force real survival.
            </div>
          </div>
        </label>

        <div className={`mt-4 flex flex-wrap gap-2 ${compact ? "sticky bottom-0 bg-black pt-2" : ""}`}>
          <button
            type="button"
            disabled={disabled}
            onClick={handleRun}
            className="rounded-2xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black shadow-[0_0_16px_rgba(250,204,21,0.4)] hover:bg-yellow-300 disabled:opacity-50"
          >
            Pull the lever
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Clear results
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={randomizeProbs}
            className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Randomize odds
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={resetProbs}
            className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Reset to 50/50
          </button>
        </div>
      </SectionCard>

      <SectionCard className={compact ? "p-3" : "p-4"}>
        <div className="mb-3 text-sm font-semibold text-white">Odds for each step</div>
        <ProbabilityEditor probs={probs} setProbs={setProbs} stepNames={stepNames} setStepNames={setStepNames} />
      </SectionCard>
    </div>
  );
}

function MatrixCell({ status, small = false }) {
  const [flicker, setFlicker] = useState("✓");

  useEffect(() => {
    if (status !== "spinning") return;
    const id = setInterval(() => {
      setFlicker((f) => (f === "✓" ? "X" : "✓"));
    }, 90);
    return () => clearInterval(id);
  }, [status]);

  const variants = {
    pending: "border-slate-700 bg-white/[0.03] text-slate-600",
    success: "border-emerald-400/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]",
    fail: "border-red-400/50 bg-red-500/10 text-red-300",
    wap: "border-yellow-400/70 border-dashed bg-yellow-400/10 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]",
    spinning: "border-yellow-400 bg-yellow-400/10 text-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.5)] animate-pulse",
  };

  const glyph = {
    pending: "•",
    success: "✓",
    fail: "X",
    wap: "☘",
    spinning: flicker,
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl border font-bold ${small ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"} ${variants[status]}`}
    >
      {glyph[status]}
    </div>
  );
}

function ResultBadges({ result, resolved }) {
  if (!resolved) {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="rounded-full border border-slate-700 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-500">
          Results appear here after you pull the lever
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <div className="rounded-full border border-slate-700 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-200">
        Survived: {result.survivors.length}
      </div>
      {result.survivors.length === 1 && (
        <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-300">
          Just one made it, alone ⭐
        </div>
      )}
      {result.survivors.length > 1 && (
        <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-300">
          {result.survivors.length} made it independently ⭐
        </div>
      )}
      {result.wapFilledEnv !== null && (
        <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-300">
          Fallback saved environment {result.wapFilledEnv + 1}
        </div>
      )}
      <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-300">
        🏆 WAPPER won
      </div>
    </div>
  );
}

function DesktopMatrixViewer({ numEnvs, probs, display, runKey, stepNames, phase }) {
  const steps = probs.length;
  const displayOrder = Array.from({ length: steps }, (_, i) => steps - 1 - i);
  const isSurvivorCol = (c) => display.survivors.includes(c);

  return (
    <div>
      <SectionCard className="overflow-hidden p-3 sm:p-4 lg:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">What's going on here</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Each column is a separate environment running the same chain of steps (rows),
              from the first step at the bottom to the last at the top. Every step has its own
              odds of succeeding — raise them and survival gets easy, lower them and it's a long shot.
              Swipe sideways to see every environment.
            </p>
          </div>
          <Legend />
        </div>

        <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-700 bg-black/30 overscroll-contain touch-pan-x">
          <div className="min-w-max p-3 sm:p-4">
            <div
              className="grid items-center gap-2"
              style={{ gridTemplateColumns: `minmax(150px, 200px) repeat(${numEnvs}, 44px) minmax(100px, 1fr)` }}
            >
              <div />
              {Array.from({ length: numEnvs }, (_, c) => (
                <div key={`star-${runKey}-${c}`} className="text-center text-sm text-slate-400">
                  {isSurvivorCol(c) ? "⭐" : ""}
                </div>
              ))}
              <div />

              {displayOrder.map((rowIdx) => (
                <React.Fragment key={`row-${runKey}-${rowIdx}`}>
                  <div className="pr-2">
                    <div className="text-sm font-medium leading-5 text-white">
                      {stepNames[rowIdx] || `Step ${rowIdx + 1}`}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {Math.round(probs[rowIdx] * 100)}% chance to succeed
                    </div>
                  </div>

                  {Array.from({ length: numEnvs }, (_, c) => (
                    <MatrixCell key={`cell-${runKey}-${rowIdx}-${c}`} status={display.grid[rowIdx][c].status} />
                  ))}

                  <div className="pl-2 text-xs leading-5 text-slate-400 sm:text-sm">
                    {rowIdx === 0 ? "First step" : rowIdx === steps - 1 ? "Final step" : "Along the way"}
                  </div>
                </React.Fragment>
              ))}

              <div />
              {Array.from({ length: numEnvs }, (_, i) => (
                <div key={`num-${runKey}-${i}`} className="text-center">
                  <div className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-2 py-1 text-xs font-bold text-yellow-300">
                    {i + 1}
                  </div>
                </div>
              ))}
              <div className="text-sm text-slate-400">environment #</div>
            </div>
          </div>
        </div>

        <ResultBadges result={display} resolved={phase === "resolved"} />
      </SectionCard>
    </div>
  );
}

export default function GambleSimulationApp() {
  const [numEnvs, setNumEnvs] = useState(10);
  const [applyWAPWhenAllFail, setApplyWAPWhenAllFail] = useState(true);
  const [probs, setProbs] = useState(DEFAULT_STEPS);
  const [stepNames, setStepNames] = useState(DEFAULT_STEP_NAMES.slice(0, DEFAULT_STEPS.length));
  const [result, setResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | spinning | resolved
  const [revealStep, setRevealStep] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [wapperModalOpen, setWapperModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const steps = probs.length;
  const spinning = phase === "spinning";

  const expectedStats = useMemo(() => {
    const p = expectedPerLineage(probs);
    return { p, expectedCount: p * numEnvs };
  }, [probs, numEnvs]);

  const randomizeProbs = () =>
    setProbs((prev) => prev.map(() => Number(Math.random().toFixed(2))));

  const resetProbs = () =>
    setProbs(Array.from({ length: steps }, () => 0.5));

  const handleRun = () => {
    if (spinning) return;
    const computed = runSimulation({ numEnvs, probs, applyWAPWhenAllFail });
    setPendingResult(computed);
    setResult(null);
    setResultModalOpen(false);
    setRevealStep(0);
    setPhase("spinning");
    setControlsOpen(false);
    setRunKey((k) => k + 1);
  };

  const handleClear = () => {
    setResult(null);
    setPendingResult(null);
    setPhase("idle");
    setRevealStep(0);
    setResultModalOpen(false);
    setRunKey((k) => k + 1);
  };

  useEffect(() => {
    if (phase !== "spinning") return;
    if (revealStep >= steps) {
      setPhase("resolved");
      setResult(pendingResult);
      return;
    }
    const t = setTimeout(() => setRevealStep((r) => r + 1), ROW_REVEAL_MS);
    return () => clearTimeout(t);
  }, [phase, revealStep, steps, pendingResult]);

  useEffect(() => {
    if (phase !== "resolved") return;
    const t = setTimeout(() => setResultModalOpen(true), 2500);
    return () => clearTimeout(t);
  }, [phase, runKey]);

  const adjustSteps = (delta) => {
    if (spinning) return;
    let nextProbs = [...probs];
    let nextNames = [...stepNames];

    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        nextProbs.push(0.5);
        nextNames.push(`New step ${nextNames.length + 1}`);
      }
    }
    if (delta < 0) {
      for (let i = 0; i < -delta; i++) {
        nextProbs.pop();
        nextNames.pop();
      }
    }
    if (nextProbs.length < 1) nextProbs = [0.5];
    if (nextNames.length < 1) nextNames = ["Step 1"];

    setProbs(nextProbs);
    setStepNames(nextNames);
  };

  const outcomeLabel = phase === "resolved" && result
    ? result.survivors.length === 0
      ? "Nobody survived"
      : result.survivors.length === 1
        ? "One survivor"
        : `${result.survivors.length} survivors`
    : "Not run yet";

  // Build what the grid should actually display right now, given the phase.
  const display = useMemo(() => {
    if (phase === "resolved" && result) return result;

    if (phase === "spinning" && pendingResult) {
      const grid = pendingResult.grid.map((row, r) =>
        row.map((cell) => {
          if (r < revealStep) return cell;
          if (r === revealStep) return cell.status === "pending" ? cell : { status: "spinning" };
          return { status: "pending" };
        })
      );
      return { grid, survivors: [], wapFilledEnv: null };
    }

    return { grid: emptyGrid(steps, numEnvs), survivors: [], wapFilledEnv: null };
  }, [phase, result, pendingResult, revealStep, steps, numEnvs]);

  const drawerControls = (
    <Controls
      compact={true}
      numEnvs={numEnvs}
      setNumEnvs={setNumEnvs}
      steps={steps}
      adjustSteps={adjustSteps}
      applyWAPWhenAllFail={applyWAPWhenAllFail}
      setApplyWAPWhenAllFail={setApplyWAPWhenAllFail}
      randomizeProbs={randomizeProbs}
      resetProbs={resetProbs}
      handleRun={handleRun}
      handleClear={handleClear}
      probs={probs}
      setProbs={setProbs}
      stepNames={stepNames}
      setStepNames={setStepNames}
      disabled={spinning}
    />
  );

  const matrixBlock = (
    <DesktopMatrixViewer
      numEnvs={numEnvs}
      probs={probs}
      display={display}
      runKey={runKey}
      stepNames={stepNames}
      phase={phase}
    />
  );

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-black text-slate-100"
      style={{ backgroundImage: "radial-gradient(circle at 50% 0%, #1a0a2e 0%, #000 70%)" }}
    >
      {phase === "resolved" && resultModalOpen && result && (
        <WapperResultModal
          result={result}
          onClose={() => setResultModalOpen(false)}
          onAdjust={() => {
            setResultModalOpen(false);
            setControlsOpen(true);
          }}
        />
      )}

      <div className="mx-auto max-w-[1600px] p-3 pb-24 sm:p-5 sm:pb-28 lg:p-6 lg:pb-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-yellow-400">
              Tautologies R Us · Hoboken NJ
            </p>
            <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Origin-of-Life <span className="text-yellow-400">Gamble</span>
            </h1>
            <p className="mt-2 max-w-2xl overflow-x-auto whitespace-nowrap text-[11px] leading-5 text-slate-400 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible sm:whitespace-normal sm:text-base sm:leading-6 [&::-webkit-scrollbar]:hidden">
              Set some odds, pull the lever, see who survives the gauntlet.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setWapperModalOpen(true)}
            title="See your WAPPER"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/40 bg-yellow-400/10 text-lg hover:bg-yellow-400/20 sm:h-12 sm:w-12 sm:text-xl"
          >
            🏆
          </button>
        </div>

        {/* Guide strip + primary action, combined to cut dead space */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <GuideStrip active={phase === "resolved" ? "see" : "run"} />

          <div className="hidden items-center justify-center gap-4 sm:flex sm:justify-end">
            <button
              type="button"
              disabled={spinning}
              onClick={() => setControlsOpen(true)}
              className="rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              Set the odds
            </button>

            <Lever
              pulling={spinning}
              disabled={spinning}
              onPull={handleRun}
              label={spinning ? "Spinning…" : "Pull the lever"}
            />
          </div>
        </div>

        <LightFrame top={12} side={6} active={spinning} maxWidth="max-w-none">
          {matrixBlock}
        </LightFrame>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowMath((v) => !v)}
            className="text-xs font-medium uppercase tracking-wide text-slate-500 hover:text-slate-300"
          >
            {showMath ? "Hide the math ▲" : "Show the math ▼"}
          </button>

          {showMath && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Chance any one survives"
                value={formatProbability(expectedStats.p)}
                hint="The odds that a single environment makes it through every step, back to back."
              />
              <MetricCard
                label="Expected to survive"
                value={formatExpectedCount(expectedStats.expectedCount)}
                hint="On average, how many environments you'd expect to make it, given these odds."
              />
              <MetricCard
                label="This run's result"
                value={outcomeLabel}
                hint="What actually happened, which can differ from the average above."
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-yellow-500/20 bg-black/90 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
          <button
            type="button"
            disabled={spinning}
            onClick={() => setControlsOpen(true)}
            className="flex-1 rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 active:bg-white/10 disabled:opacity-50"
          >
            Set the odds
          </button>
          <Lever
            compact
            pulling={spinning}
            disabled={spinning}
            onPull={handleRun}
            label={spinning ? "Spinning…" : "Pull"}
          />
        </div>
      </div>

      <ConfigDrawer open={controlsOpen} onClose={() => setControlsOpen(false)} onRun={handleRun}>
        {drawerControls}
      </ConfigDrawer>

      {wapperModalOpen && <WapperScreen onClose={() => setWapperModalOpen(false)} />}
    </div>
  );
}