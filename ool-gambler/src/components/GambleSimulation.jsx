import React, { useEffect, useMemo, useRef, useState } from "react";
import WapperScreen from "./screens/WapperScreen";
import WapperResultModal from "./screens/WapperResultModal";
import LightFrame from "./screens/LightFrame";

// Without this, any exception thrown during render (a bad array index, a
// stale ref, etc.) unmounts the whole tree and leaves a blank white screen
// with nothing in the UI to explain why. This catches that and shows a
// recoverable message instead, and logs the real error to the console so
// it's actually debuggable next time it happens.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Life Jackpot crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6 text-center text-slate-200">
          <div className="text-lg font-bold text-yellow-400">Something broke the roll.</div>
          <div className="max-w-md text-sm text-slate-400">
            {String(this.state.error?.message || this.state.error)}
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

// --- responsive helper --------------------------------------------------

function useIsMobile(breakpointPx = 640) {
  // window.innerWidth alone is unreliable if the page is missing (or has a
  // broken) <meta name="viewport" content="width=device-width, ...">. In
  // that case mobile browsers report an inflated layout-viewport width
  // (often ~980px) even on an actual phone. As a fallback, also treat coarse
  // pointer + no hover (i.e. touch-only devices, which phones/tablets are
  // and desktops/laptops with a mouse are not) as a mobile signal, so the
  // compact layout still kicks in even if the width check alone fails.
  const getIsMobile = () => {
    if (typeof window === "undefined") return false;
    const narrow = window.innerWidth < breakpointPx;
    const touchOnly =
      window.matchMedia?.("(pointer: coarse) and (hover: none)").matches ?? false;
    return narrow || touchOnly;
  };

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const widthMq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const touchMq = window.matchMedia("(pointer: coarse) and (hover: none)");
    const update = () => setIsMobile(getIsMobile());
    update();
    widthMq.addEventListener("change", update);
    touchMq.addEventListener("change", update);
    return () => {
      widthMq.removeEventListener("change", update);
      touchMq.removeEventListener("change", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpointPx]);

  return isMobile;
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
        <span>WAPPER</span>
      </div>
    </div>
  );
}

// --- mobile "what's happening right now" banner --------------------------
// Shown only on mobile, only while the lever is spinning, pinned above the
// grid so the player always sees *something* moving even if the full grid
// needs horizontal scrolling to view every environment.

function ActiveStepBanner({ show, stepIndex, totalSteps, stepName, prob }) {
  if (!show) return null;
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-yellow-400 bg-yellow-400/15 px-4 py-3 shadow-[0_0_16px_rgba(250,204,21,0.35)] sm:hidden">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
          Step {stepIndex + 1} of {totalSteps} · rolling…
        </div>
        <div className="truncate text-sm font-semibold text-white">{stepName}</div>
      </div>
      <div className="ml-3 shrink-0 rounded-xl bg-black/50 px-2.5 py-1.5 text-xs font-bold text-yellow-300">
        {Math.round(prob * 100)}%
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
              className="cursor-pointer rounded-2xl bg-yellow-400 px-3 py-2 text-sm font-bold text-black active:bg-yellow-300"
            >
              Pull lever
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-2xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300"
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
                className="cursor-pointer rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
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
                className="cursor-pointer rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
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
            className="cursor-pointer rounded-2xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black shadow-[0_0_16px_rgba(250,204,21,0.4)] hover:bg-yellow-300 disabled:opacity-50"
          >
            Pull the lever
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="cursor-pointer rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Clear results
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={randomizeProbs}
            className="cursor-pointer rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Randomize odds
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={resetProbs}
            className="cursor-pointer rounded-2xl border border-slate-700 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
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

function MatrixCell({ status, size = "md" }) {
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

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl border font-bold ${sizeClasses[size]} ${variants[status]}`}
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

// Custom eased scroll animation. Native `scrollIntoView({behavior:'smooth'})`
// tends to look like an abrupt jump when re-triggered every ~450ms (each new
// call cancels the previous one mid-flight). This runs its own rAF loop with
// an ease-out curve and a cancel token so repeated calls hand off smoothly
// instead of jumping.
function animateScrollLeft(container, target, duration, tokenRef) {
  const start = container.scrollLeft;
  const change = target - start;
  const startTime = performance.now();
  const myToken = {};
  tokenRef.current = myToken;

  function step(now) {
    if (tokenRef.current !== myToken) return; // superseded by a newer scroll
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    container.scrollLeft = start + change * eased;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function ScrollHint({ side, visible }) {
  if (!visible) return null;
  const isLeft = side === "left";
  return (
    <div
      className={`pointer-events-none absolute top-0 z-20 h-full w-10 sm:hidden ${isLeft ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"} from-black/70 to-transparent`}
    >
      <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "left-0.5" : "right-0.5"} rounded-full bg-black/70 px-1 py-2 text-xs text-yellow-300`}>
        {isLeft ? "‹" : "›"}
      </div>
    </div>
  );
}

function MatrixViewer({ numEnvs, probs, display, runKey, stepNames, phase, isMobile, revealStep }) {
  const steps = probs.length;
  const displayOrder = Array.from({ length: steps }, (_, i) => steps - 1 - i);
  const isSurvivorCol = (c) => display.survivors.includes(c);

  const scrollRef = useRef(null);
  const colRefs = useRef({});
  const [scrollHint, setScrollHint] = useState({ left: false, right: false });
  const [openStepInfo, setOpenStepInfo] = useState(null);

  // Tighter sizing on mobile so the default 10 environments fit (or come close
  // to fitting) without needing to hunt via horizontal scroll.
  const labelCol = isMobile ? "44px" : "minmax(240px, 340px)";
  const cellCol = isMobile ? "26px" : "44px";
  const lastCol = isMobile ? "38px" : "minmax(100px, 1fr)";
  const gapClass = isMobile ? "gap-1" : "gap-2";
  const cellSize = isMobile ? "xs" : "md";

  const gapPx = isMobile ? 4 : 8;
  // Grid `gap` is empty space outside any cell's box, so the sticky label
  // column's background doesn't cover it — leaving a seam where the
  // scrolling cells' true (translucent) backdrop shows through as they
  // slide underneath. Bleeding the sticky box rightward by the gap amount
  // (negative margin) and compensating with equal padding keeps the text
  // position the same while the background now covers that seam.
  const stickySpacerStyle = { marginRight: -gapPx };
  const stickyLabelStyle = { marginRight: -gapPx, paddingRight: gapPx };

  const updateScrollHint = () => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollHint({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  // Drop refs to columns that no longer exist so a stale DOM node never
  // gets passed to getBoundingClientRect() in the auto-scroll effect below.
  useEffect(() => {
    Object.keys(colRefs.current).forEach((key) => {
      if (Number(key) >= numEnvs) delete colRefs.current[key];
    });
  }, [numEnvs]);

  useEffect(() => {
    updateScrollHint();
  }, [numEnvs, runKey, isMobile]);

  useEffect(() => {
    setOpenStepInfo(null);
  }, [runKey]);

  const scrollAnimToken = useRef(null);

  // While spinning, keep the leading (still-alive) environment centered in
  // view — on mobile because the grid rarely fits on screen at once, and on
  // desktop too so a wide environment count (e.g. 30-50) still gets the same
  // "camera follows the action" treatment instead of losing track off-screen.
  useEffect(() => {
    if (phase !== "spinning") return;

    const aliveCols = [];
    for (let c = 0; c < numEnvs; c++) {
      let alive = true;
      for (let r = 0; r < revealStep; r++) {
        if (display.grid[r][c]?.status === "fail") {
          alive = false;
          break;
        }
      }
      if (alive) aliveCols.push(c);
    }

    if (aliveCols.length === 0) return;
    const targetCol = aliveCols[Math.floor(aliveCols.length / 2)];

    const timeoutId = setTimeout(() => {
      const container = scrollRef.current;
      const el = colRefs.current[targetCol];
      if (!container || !el) return;

      const colRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const colCenter = colRect.left - containerRect.left + colRect.width / 2;
      const target = container.scrollLeft + colCenter - containerRect.width / 2;

      animateScrollLeft(container, target, 650, scrollAnimToken);
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [revealStep, phase, isMobile, numEnvs, display]);

  return (
    <div>
      <SectionCard className="overflow-hidden p-3 sm:p-4 lg:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Legend />
        </div>

        {isMobile && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-400 sm:hidden">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/5 px-2 py-1 font-semibold text-cyan-300">
              Tap S1, S2… to read each step
            </span>
          </div>
        )}

        <div className="relative">
          <ScrollHint side="left" visible={isMobile && scrollHint.left} />
          <ScrollHint side="right" visible={isMobile && scrollHint.right} />

          <div
            ref={scrollRef}
            onScroll={updateScrollHint}
            className="overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-700 bg-black/30 overscroll-contain touch-pan-x"
          >
            <div className="min-w-max p-2 sm:p-4">
              <div
                className={`grid items-center ${gapClass}`}
                style={{ gridTemplateColumns: `${labelCol} repeat(${numEnvs}, ${cellCol}) ${lastCol}` }}
              >
                <div className="sticky left-0 z-10 self-stretch bg-slate-950" style={stickySpacerStyle} />
                {Array.from({ length: numEnvs }, (_, c) => (
                  <div
                    key={`star-${runKey}-${c}`}
                    ref={(el) => {
                      colRefs.current[c] = el;
                    }}
                    className="text-center text-[10px] text-slate-400 sm:text-sm"
                  >
                    {isSurvivorCol(c) ? "⭐" : ""}
                  </div>
                ))}
                <div />

                {displayOrder.map((rowIdx) => (
                  <React.Fragment key={`row-${runKey}-${rowIdx}`}>
                    <div className="sticky left-0 z-10 self-stretch bg-slate-950 py-2 pl-1 pr-1 sm:py-3 sm:pl-3 sm:pr-4" style={stickyLabelStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          isMobile && setOpenStepInfo((prev) => (prev === rowIdx ? null : rowIdx))
                        }
                        className="block w-full text-left"
                      >
                        <div className="truncate text-[11px] font-medium leading-4 text-white underline decoration-cyan-400/50 decoration-dotted underline-offset-2 sm:overflow-visible sm:text-clip sm:whitespace-normal sm:text-sm sm:leading-5 sm:no-underline">
                          {isMobile ? `S${rowIdx + 1}` : stepNames[rowIdx] || `Step ${rowIdx + 1}`}
                        </div>
                      </button>
                      <div className="mt-1 hidden text-xs text-slate-500 sm:block">
                        {Math.round(probs[rowIdx] * 100)}% chance to succeed
                      </div>
                    </div>

                    {Array.from({ length: numEnvs }, (_, c) => (
                      <MatrixCell
                        key={`cell-${runKey}-${rowIdx}-${c}`}
                        status={display.grid[rowIdx][c].status}
                        size={cellSize}
                      />
                    ))}

                    <div className="pl-2 text-xs leading-5 text-slate-400 sm:text-sm">
                      {!isMobile && (rowIdx === 0 ? "First step" : rowIdx === steps - 1 ? "Final step" : "Along the way")}
                    </div>
                  </React.Fragment>
                ))}

                <div className="sticky left-0 z-10 self-stretch bg-slate-950" style={stickySpacerStyle} />
                {Array.from({ length: numEnvs }, (_, i) => (
                  <div key={`num-${runKey}-${i}`} className="text-center">
                    <div className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-1 py-0.5 text-[10px] font-bold text-yellow-300 sm:px-2 sm:py-1 sm:text-xs">
                      {i + 1}
                    </div>
                  </div>
                ))}
                <div className="text-sm text-slate-400">{!isMobile && "environment #"}</div>
              </div>
            </div>
          </div>
        </div>

        {isMobile && openStepInfo !== null && (
          <div className="mt-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2.5 sm:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                Step {openStepInfo + 1} of {steps}
              </div>
              <div className="shrink-0 rounded-lg bg-black/50 px-2 py-1 text-xs font-bold text-cyan-300">
                {Math.round(probs[openStepInfo] * 100)}%
              </div>
            </div>
            <div className="mt-1 text-sm leading-5 text-white">
              {stepNames[openStepInfo] || `Step ${openStepInfo + 1}`}
            </div>
          </div>
        )}

        <ResultBadges result={display} resolved={phase === "resolved"} />
      </SectionCard>
    </div>
  );
}

// --- quick "boost everything at once" slider ---------------------------
// A single slider that sets every step's probability to the same value in
// one motion, for fast iteration. The detailed per-step editor (opened via
// "Set the odds") still exists separately for fine-grained control.
function QuickOddsSlider({ probs, setProbs, disabled, expectedStats, outcomeLabel }) {
  const allSame = probs.every((p) => Math.abs(p - probs[0]) < 0.001);
  const derivedValue = allSame
    ? probs[0]
    : probs.reduce((a, b) => a + b, 0) / probs.length;

  const [value, setValue] = useState(derivedValue);

  // Keep the slider's displayed position honest if probs change from
  // elsewhere (the advanced editor, randomize, reset, step count change).
  useEffect(() => {
    setValue(derivedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [probs.length, derivedValue]);

  const handleChange = (e) => {
    const v = Number(e.target.value);
    setValue(v);
    setProbs((prev) => prev.map(() => v));
  };

  return (
    <div className="mt-3 rounded-2xl border border-yellow-500/20 bg-white/[0.03] p-3 sm:p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300 sm:text-sm">
          Increase Probability of Each Step (For All Steps)
        </span>
        <span className="rounded-lg bg-black px-2.5 py-1 text-sm font-bold text-yellow-300 ring-1 ring-slate-700">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-yellow-400 disabled:opacity-50"
      />
      {/* <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wide text-slate-500">
        <span>never</span>
        <span>50 / 50</span>
        <span>always</span>
      </div> */}

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
        <span className="font-semibold uppercase tracking-wide text-slate-500">The math</span>
        {/* <span>
          Any one survives:{" "}
          <span className="font-semibold text-slate-300">{formatProbability(expectedStats.p)}</span>
        </span> */}
        <span>
          Expected survivors:{" "}
          <span className="font-semibold text-slate-300">{formatExpectedCount(expectedStats.expectedCount)}</span>
        </span>
        {/* <span>
          This run:{" "}
          <span className="font-semibold text-slate-300">{outcomeLabel}</span>
        </span> */}
      </div>
    </div>
  );
}

function GambleSimulationApp() {
  const isMobile = useIsMobile();

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

  const matrixSectionRef = useRef(null);

  // Some navigations (back/forward, or arriving with the browser's scroll
  // restoration) can land on this page already scrolled down. Force the
  // very first render to start from the top, and disable the browser's own
  // scroll restoration so it can't re-scroll us back down afterward.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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

    // Bring the matrix into view immediately so the player sees the roll
    // start instead of staring at a header/buttons with nothing moving.
    requestAnimationFrame(() => {
      matrixSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    <MatrixViewer
      numEnvs={numEnvs}
      probs={probs}
      display={display}
      runKey={runKey}
      stepNames={stepNames}
      phase={phase}
      isMobile={isMobile}
      revealStep={revealStep}
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

      <div className="mx-auto max-w-[1600px] p-3 pb-6 sm:p-5 lg:p-6">
        {/* Header: title, then a single unified action bar directly beneath
            it — both controls share one visual container so they read as
            a matched pair instead of two loose buttons. */}
        <div className="mb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-4xl">
            <span className="text-white">Life </span>
            <span
              className="text-red-500"
              style={{ textShadow: "0 0 12px rgba(239,68,68,0.8)" }}
            >
              Jackpot
            </span>
          </h1>

          <div className="mt-3 flex items-stretch gap-2 rounded-2xl border border-yellow-500/20 bg-white/[0.03] p-1.5">
            <button
              type="button"
              disabled={spinning}
              onClick={() => setControlsOpen(true)}
              className="cursor-pointer flex-1 rounded-xl border border-slate-700 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:px-5 sm:py-3 sm:text-base"
            >
              ⚙ Set the odds
            </button>

            <button
              type="button"
              disabled={spinning}
              onClick={handleRun}
              className="cursor-pointer flex-1 rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-black shadow-[0_0_16px_rgba(250,204,21,0.45)] transition hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
            >
              {spinning ? "Spinning…" : "🎰 Pull the Lever"}
            </button>
          </div>

          <QuickOddsSlider
            probs={probs}
            setProbs={setProbs}
            disabled={spinning}
            expectedStats={expectedStats}
            outcomeLabel={outcomeLabel}
          />
        </div>

        <div ref={matrixSectionRef} className="scroll-mt-4">
          <ActiveStepBanner
            show={spinning}
            stepIndex={revealStep}
            totalSteps={steps}
            stepName={stepNames[revealStep] || `Step ${revealStep + 1}`}
            prob={probs[revealStep] ?? 0}
          />

          <LightFrame top={12} side={6} active={spinning} maxWidth="max-w-none">
            {matrixBlock}
          </LightFrame>
        </div>
      </div>

      <ConfigDrawer open={controlsOpen} onClose={() => setControlsOpen(false)} onRun={handleRun}>
        {drawerControls}
      </ConfigDrawer>

      {wapperModalOpen && <WapperScreen onClose={() => setWapperModalOpen(false)} />}
    </div>
  );
}

export default function GambleSimulationAppWithBoundary(props) {
  return (
    <ErrorBoundary>
      <GambleSimulationApp {...props} />
    </ErrorBoundary>
  );
}