import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const FALLBACK_LIBRARY = [
  { id: "capibara", steps: 58 },
  { id: "cat", steps: 31 },
  { id: "dolphin", steps: 33 },
  { id: "elephant", steps: 50 },
  { id: "fish", steps: 60 },
  { id: "pig", steps: 57 },
  { id: "seal", steps: 43 },
  { id: "turkey", steps: 66 },
  { id: "whale", steps: 37 },
  { id: "wolf", steps: 33 },
];

const FALLBACK_SIMILAR = {
  whale: ["dolphin", "seal", "fish"],
  dolphin: ["whale", "seal", "fish"],
  seal: ["whale", "dolphin", "fish"],
  cat: ["wolf", "capibara", "pig"],
  wolf: ["cat", "capibara", "pig"],
  capibara: ["cat", "wolf", "pig"],
  pig: ["cat", "wolf", "capibara"],
  fish: ["whale", "dolphin", "seal"],
  elephant: ["pig", "capibara", "seal"],
  turkey: ["wolf", "cat", "capibara"],
};

const FALLBACK_ORIGIN = [
  { animal: "whale", step: 24, sharedWith: ["dolphin"] },
  { animal: "wolf", step: 1, sharedWith: ["turkey", "whale"] },
  { animal: "seal", step: 1, sharedWith: ["cat", "dolphin", "elephant", "fish", "pig"] },
  { animal: "capibara", step: 1, sharedWith: [] },
];

// Whale and dolphin share steps 1-24 — exclude from Part 1 to avoid ambiguity
const SHARED_RANGES = [
  { animals: ["whale", "dolphin"], upTo: 24 },
];

const IMG = (id, n) =>
  n === "figure"
    ? `./assets/origami/${id}/figure.jpg`
    : `./assets/origami/${id}/${n}.jpg`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── TRIAL BUILDERS ───────────────────────────────────────────────────────────

function buildPart1Trials(library, similar, count = 3) {
  const animals = shuffle([...library]);
  const trials = [];

  for (const animal of animals) {
    if (trials.length >= count) break;

    const sharedRange = SHARED_RANGES.find((r) => r.animals.includes(animal.id));
    const excludeUpTo = sharedRange ? sharedRange.upTo : 0;

    const eligible = Array.from({ length: animal.steps }, (_, i) => i + 1).filter(
      (s) => s > excludeUpTo + 1 && s < animal.steps
    );
    if (eligible.length < 1) continue;

    const correctStep = eligible[Math.floor(Math.random() * eligible.length)];
    const ratio = correctStep / animal.steps;
    const distractorAnimals = (similar[animal.id] || []).slice(0, 3);

    const distractors = distractorAnimals.map((did) => {
      const dAnimal = library.find((a) => a.id === did);
      if (!dAnimal) return null;
      const base = Math.round(ratio * dAnimal.steps);
      const jitter = Math.floor((Math.random() - 0.5) * dAnimal.steps * 0.1);
      const dStep = Math.max(2, Math.min(dAnimal.steps - 1, base + jitter));
      return { animalId: did, step: dStep };
    }).filter(Boolean);

    if (distractors.length < 3) continue;

    const options = shuffle([
      { animalId: animal.id, step: correctStep, correct: true },
      ...distractors.map((d) => ({ ...d, correct: false })),
    ]);

    trials.push({
      type: "part1",
      animal: animal.id,
      totalSteps: animal.steps,
      correctStep,
      options,
    });
  }

  return trials;
}

function buildPart2Trials(origin, library, count = 3) {
  const picked = shuffle([...origin]).slice(0, count);
  return picked.map((entry) => {
    const allAnimals = library.map((a) => a.id);
    const correct = new Set([entry.animal, ...entry.sharedWith]);
    const options = shuffle(allAnimals).map((id) => ({
      animalId: id,
      correct: correct.has(id),
    }));
    return {
      type: "part2",
      sourceAnimal: entry.animal,
      sourceStep: entry.step,
      sharedWith: entry.sharedWith,
      options,
      noneCorrect: entry.sharedWith.length === 0,
    };
  });
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────

function Label({ children, className = "" }) {
  return (
    <p className={`text-xs font-mono uppercase tracking-widest text-stone-400 ${className}`}>
      {children}
    </p>
  );
}

function Stamp({ children, color = "stone" }) {
  const map = {
    stone: "border-stone-700 text-stone-700",
    red: "border-red-500 text-red-500",
    emerald: "border-emerald-600 text-emerald-600",
    amber: "border-amber-600 text-amber-600",
  };
  return (
    <span className={`inline-block border-2 rounded px-2 py-0.5 text-xs font-mono uppercase tracking-widest rotate-[-1.5deg] ${map[color]}`}>
      {children}
    </span>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div className="flex gap-1.5 items-center flex-shrink-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={[
          "rounded-full transition-all duration-300",
          i < current ? "w-2 h-2 bg-stone-700"
            : i === current ? "w-3 h-3 bg-stone-900"
              : "w-2 h-2 bg-stone-300",
        ].join(" ")} />
      ))}
    </div>
  );
}

function ContinueBtn({ onClick, label = "Continue →" }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full py-3.5 rounded-2xl bg-stone-900 text-white font-mono text-sm uppercase tracking-widest hover:bg-stone-700 active:scale-95 transition-all"
    >
      {label}
    </button>
  );
}

// ─── PART 1 TRIAL ─────────────────────────────────────────────────────────────

function Part1Trial({ trial, trialNumber, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected?.correct;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>Part 1 · trial {trialNumber} of {total}</Label>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1 leading-tight">
            Which fold belongs<br />to this figure?
          </h2>
        </div>
        <ProgressDots total={total} current={trialNumber - 1} />
      </div>

      <div className="space-y-1.5">
        <Label>Target — {trial.animal}</Label>
        <div className="w-36 mx-auto rounded-2xl overflow-hidden border-2 border-stone-800 aspect-square bg-stone-50">
          <img
            src={IMG(trial.animal, "figure")}
            alt={trial.animal}
            className="w-full h-full object-cover p-2 ratio-2/3"
            loading="lazy"
          />
        </div>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">
        One of these four folds is a real intermediate step from this figure's folding sequence.
        The other three belong to different animals. Pick the one that belongs here.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {trial.options.map((opt, i) => {
          const isSelected = selected?.step === opt.step && selected?.animalId === opt.animalId;
          const showCorrect = revealed && opt.correct;
          const showWrong = revealed && isSelected && !opt.correct;
          const isDim = revealed && !isSelected && !opt.correct;

          return (
            <motion.button
              key={`${opt.animalId}-${opt.step}`}
              onClick={() => { if (!revealed) { setSelected(opt); setRevealed(true); } }}
              disabled={revealed}
              whileHover={!revealed ? { scale: 1.02 } : {}}
              whileTap={!revealed ? { scale: 0.97 } : {}}
              className={[
                "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all focus:outline-none",
                showCorrect ? "border-emerald-500 bg-emerald-50"
                  : showWrong ? "border-red-500 bg-red-50"
                    : isDim ? "border-stone-100 bg-stone-50 opacity-25"
                      : isSelected ? "border-stone-800 bg-stone-50"
                        : "border-stone-200 bg-white hover:border-stone-400 cursor-pointer",
              ].join(" ")}
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={IMG(opt.animalId, opt.step)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className={`text-xs font-mono uppercase tracking-wider ${showCorrect ? "text-emerald-700"
                : showWrong ? "text-red-600"
                  : "text-stone-400"
                }`}>
                {revealed ? opt.animalId : `Option ${i + 1}`}
              </span>
              {showWrong && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">✕</div>
              )}
              {showCorrect && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden">
            <div className={`rounded-2xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
              {isCorrect ? (
                <>
                  <Stamp color="emerald">Correct</Stamp>
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                    That fold does belong to the <strong>{trial.animal}</strong> sequence — step {trial.correctStep} of {trial.totalSteps}.
                    But notice: you couldn't be certain from the shape alone.
                    You needed to already know which sequence produced it.
                  </p>
                </>
              ) : (
                <>
                  <Stamp color="red">Incorrect</Stamp>
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                    The correct fold was step {trial.correctStep} of the <strong>{trial.animal}</strong> sequence.
                    You picked a fold from <strong>{selected?.animalId}</strong>.
                    Visually similar animals produce visually similar intermediate folds —
                    shape alone cannot tell you which sequence a fold belongs to.
                  </p>
                </>
              )}
            </div>
            <ContinueBtn onClick={() => onNext({ correct: isCorrect })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PART 2 TRIAL ─────────────────────────────────────────────────────────────

function Part2Trial({ trial, trialNumber, total, onNext }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [choseNone, setChoseNone] = useState(false);

  const correctIds = new Set(
    trial.options.filter((o) => o.correct).map((o) => o.animalId)
  );

  const userCorrect = submitted && (
    choseNone
      ? trial.noneCorrect
      : [...correctIds].every((id) => selected.has(id)) &&
      [...selected].every((id) => correctIds.has(id))
  );

  const toggle = (id) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNone = () => {
    setChoseNone(true);
    setSubmitted(true);
  };

  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>Part 2 · trial {trialNumber} of {total}</Label>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1 leading-tight">
            Which figures share<br />this fold?
          </h2>
        </div>
        <ProgressDots total={total} current={trialNumber - 1} />
      </div>

      <div className="space-y-1.5">
        <Label>Intermediate fold</Label>
        <div className="w-36 mx-auto rounded-2xl overflow-hidden border-2 border-stone-800 aspect-square bg-stone-50">
          <img
            src={IMG(trial.sourceAnimal, trial.sourceStep)}
            alt=""
            className="w-full h-full object-cover p-2"
            loading="lazy"
          />
        </div>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">
        Select <em>all</em> finished figures whose folding sequence passes through
        this exact fold. There may be none — or several.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {trial.options.map((opt) => {
          const isSel = selected.has(opt.animalId);
          const showCorrect = submitted && opt.correct;
          const showWrong = submitted && isSel && !opt.correct;
          const showMissed = submitted && !isSel && opt.correct;
          const isDim = submitted && !opt.correct && !isSel;

          return (
            <motion.button
              key={opt.animalId}
              onClick={() => toggle(opt.animalId)}
              disabled={submitted}
              whileHover={!submitted ? { scale: 1.03 } : {}}
              whileTap={!submitted ? { scale: 0.97 } : {}}
              className={[
                "relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition-all focus:outline-none",
                showCorrect || showMissed ? "border-emerald-500 bg-emerald-50"
                  : showWrong ? "border-red-500 bg-red-50"
                    : isDim ? "border-stone-100 opacity-25"
                      : isSel ? "border-stone-800 bg-stone-100"
                        : "border-stone-200 bg-white hover:border-stone-400 cursor-pointer",
              ].join(" ")}
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={IMG(opt.animalId, "figure")}
                  alt={opt.animalId}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className={`text-xs font-mono capitalize ${showCorrect || showMissed ? "text-emerald-700"
                : showWrong ? "text-red-600"
                  : isSel ? "text-stone-800 font-semibold"
                    : "text-stone-400"
                }`}>
                {opt.animalId}
              </span>
              {showWrong && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✕</div>
              )}
              {(showCorrect || showMissed) && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</div>
              )}
            </motion.button>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex flex-col gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-stone-900 text-white font-mono text-sm uppercase tracking-widest hover:bg-stone-700 active:scale-95 transition-all"
            >
              Confirm selection
            </button>
          )}
          <button
            onClick={handleNone}
            className="w-full py-3 rounded-2xl border-2 border-stone-200 text-stone-500 font-mono text-sm uppercase tracking-widest hover:border-stone-500 hover:text-stone-700 transition-all"
          >
            None of these
          </button>
        </div>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden space-y-3">
            <div className={`rounded-2xl border-2 p-4 ${userCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              {trial.noneCorrect ? (
                <>
                  <Stamp color={choseNone ? "emerald" : "amber"}>
                    {choseNone ? "Correct — none share it" : "Not quite"}
                  </Stamp>
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                    This fold from <strong>{trial.sourceAnimal}</strong> step {trial.sourceStep} doesn't
                    appear in any other sequence. It looks generic enough to be shared —
                    but without tracing each full pathway, that cannot be determined from shape alone.
                  </p>
                </>
              ) : (
                <>
                  <Stamp color={userCorrect ? "emerald" : "amber"}>
                    {userCorrect ? "Correct" : "Not quite"}
                  </Stamp>
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                    This fold appears in: <strong>{[trial.sourceAnimal, ...trial.sharedWith].join(", ")}</strong>.
                    {" "}Now notice: even knowing which animals share this fold, you still can't tell
                    which sequence it originated in, or which direction the transformation ran between them.
                  </p>
                </>
              )}
            </div>
            <ContinueBtn onClick={() => onNext({ correct: userCorrect })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CONCLUSION ───────────────────────────────────────────────────────────────

function Conclusion({ answers, onReset }) {
  const p1 = answers.filter((a) => a.part === 1);
  const p2 = answers.filter((a) => a.part === 2);
  const p1Wrong = p1.filter((a) => !a.correct).length;
  const p2Wrong = p2.filter((a) => !a.correct).length;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div>
        <Label>What you just discovered</Label>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 leading-tight">
          Similarity is real.<br />Ancestry is not obvious.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2">
          <Label>Part 1</Label>
          <Stamp color={p1Wrong > 0 ? "red" : "emerald"}>
            {p1Wrong} of {p1.length} wrong
          </Stamp>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Similar animals produce similar folds. Shape alone cannot identify which sequence a fold belongs to.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2">
          <Label>Part 2</Label>
          <Stamp color={p2Wrong > 0 ? "amber" : "emerald"}>
            {p2Wrong} of {p2.length} wrong
          </Stamp>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Even confirmed shared folds don't reveal direction, origin, or whether the sequences are historically connected.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-stone-900 text-stone-100 p-5 space-y-4 text-sm leading-relaxed">
        <Label className="text-stone-500">The principle</Label>

        <p>
          <strong className="text-white">Similarity ≠ proof of shared common fold.</strong>{" "}
          Visually similar folds appear independently across different sequences,
          produced by completely different folding pathways. Pattern matching alone cannot
          determine whether two forms share a common fold.
        </p>

        <p>
          <strong className="text-white">Shared steps ≠ shared history.</strong>{" "}
          Even when a fold genuinely appears in multiple sequences, it still cannot tell you
          which sequence it originated in, which direction transformation ran,
          or whether those sequences are historically connected at all.
        </p>

        <p>
          <strong className="text-white">What would actually be required</strong>{" "}
          is a complete, step-by-step transformation pathway — viable at every single point —
          that accounts for both the similarities <em className="text-stone-300">and</em> the
          differences between the forms being compared. Without that full pathway, the claim that multiple figures share a
          common folding state is not a scientific conclusion drawn from observation.
        </p>

        <div className="rounded-xl bg-stone-800 border border-stone-700 p-4">
          <p className="text-stone-200 leading-relaxed">
            We must understand the{" "}
            <strong className="text-white">generative rules</strong>{" "}
            before inferring history. Without them, the inference is an{" "}
            <strong className="text-white">axiom</strong> —
            assumed before the evidence is examined, and insulated from the tests
            that could challenge it.
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-mono text-sm uppercase tracking-widest hover:border-stone-800 hover:text-stone-900 active:scale-95 transition-all"
      >
        Start over
      </button>
    </motion.div>
  );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────

function Intro({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">
          Can we reverse engineer an origami?
        </h1>
      </div>
      <p className="text-base text-stone-600 leading-relaxed">
        In origami, each fold becomes possible because of the shape left by the fold
        before it. Following instructions from a blank sheet to a finished
        form is straightforward. But what if you only had the finished form? Could
        you reverse engineer the process?<br></br>The
        <em> principle of continuity</em> applies: every step in a transformation pathway must
        be reachable from the one before it.
      </p>

      <div className="space-y-2">
        <div className="rounded-2xl bg-stone-100 border border-stone-200 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center font-mono flex-shrink-0">1</span>
            <p className="text-sm font-semibold text-stone-800">Can we determine an intermediate state from a final form?</p>
          </div>
          <p className="text-sm text-stone-600 pl-7">
            You'll see a finished figure and four intermediate folds drawn from similar-looking animals.
            Pick the one that genuinely belongs to that figure's sequence.
          </p>
        </div>
        <div className="rounded-2xl bg-stone-100 border border-stone-200 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center font-mono flex-shrink-0">2</span>
            <p className="text-sm font-semibold text-stone-800">Can we determine what possible forms follow an intermediate state?</p>
          </div>
          <p className="text-sm text-stone-600 pl-7">
            You'll see one intermediate fold and all finished figures.
            Select every figure whose sequence passes through that fold.
            There may be none.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 rounded-2xl bg-stone-900 text-white font-mono text-sm uppercase tracking-widest hover:bg-stone-700 active:scale-95 transition-all"
      >
        Begin
      </button>

      <p className="text-xs text-stone-400 text-center leading-relaxed">
        No trick questions. The conclusions will emerge on their own.
      </p>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function OrigamiContinuity() {
  const [library, setLibrary] = useState(FALLBACK_LIBRARY);
  const [similar, setSimilar] = useState(FALLBACK_SIMILAR);
  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [screen, setScreen] = useState("intro");
  const [trialIdx, setTrialIdx] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch("./assets/origami/index.json").then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setLibrary(d); }).catch(() => { });
    fetch("./assets/origami/similar.json").then(r => r.json())
      .then(d => { if (d?.similar) setSimilar(d.similar); }).catch(() => { });
    fetch("./assets/origami/origin.json").then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setOrigin(d); }).catch(() => { });
  }, []);

  // Interleaved: P1 P2 P1 P2 P1 P2
  const trials = useMemo(() => {
    const p1 = buildPart1Trials(library, similar, 3);
    const p2 = buildPart2Trials(origin, library, 3);
    const result = [];
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      if (p1[i]) result.push({ ...p1[i], part: 1 });
      if (p2[i]) result.push({ ...p2[i], part: 2 });
    }
    return result;
  }, [library, similar, origin]);

  const current = trials[trialIdx];
  const p1done = trials.slice(0, trialIdx).filter(t => t.part === 1).length;
  const p2done = trials.slice(0, trialIdx).filter(t => t.part === 2).length;
  const p1total = trials.filter(t => t.part === 1).length;
  const p2total = trials.filter(t => t.part === 2).length;

  const handleNext = (answer) => {
    const next = [...answers, { ...answer, part: current.part }];
    setAnswers(next);
    if (trialIdx + 1 < trials.length) {
      setTrialIdx(trialIdx + 1);
    } else {
      setScreen("conclusion");
    }
  };

  const reset = () => {
    setScreen("intro");
    setTrialIdx(0);
    setAnswers([]);
  };

  return (
    <div
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      className="min-h-screen bg-[#f7f4ef] text-stone-900"
    >
      <header className="sticky top-0 z-10 bg-[#f7f4ef]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-stone-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs leading-none">∴</span>
            </div>
            <span className="text-sm text-stone-500 tracking-wide">Origami Thought Experiment</span>
          </div>
          {screen !== "intro" && (
            <button
              onClick={reset}
              className="text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors"
            >
              restart
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 pb-24">
        <AnimatePresence mode="wait">
          {screen === "intro" && (
            <motion.div key="intro" exit={{ opacity: 0, y: -20 }}>
              <Intro onStart={() => setScreen("trial")} />
            </motion.div>
          )}

          {screen === "trial" && current && (
            <motion.div
              key={`trial-${trialIdx}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.28 }}
            >
              {current.part === 1 ? (
                <Part1Trial
                  trial={current}
                  trialNumber={p1done + 1}
                  total={p1total}
                  onNext={handleNext}
                />
              ) : (
                <Part2Trial
                  trial={current}
                  trialNumber={p2done + 1}
                  total={p2total}
                  onNext={handleNext}
                />
              )}
            </motion.div>
          )}

          {screen === "conclusion" && (
            <motion.div
              key="conclusion"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Conclusion answers={answers} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
