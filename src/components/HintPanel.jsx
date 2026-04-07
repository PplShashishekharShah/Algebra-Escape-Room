function HintPanel({
  currentHint,
  hintLevel,
  miniHintAnswer,
  setMiniHintAnswer,
  submitMiniHintAnswer,
  miniSolved,
  shake,
}) {
  if (hintLevel === 0 || !currentHint) {
    return (
      <div className=" rounded-[1.25rem] border border-dashed border-black/35 bg-black/5 p-3 text-sm text-black/85">
        Need a nudge? Tap the hint button to reveal the first clue.
      </div>
    )
  }

  return (
    <div className="max-h-[30vh]">
      <div className="inline-flex rounded-full bg-white/1 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-blue-900 font-bold">
        Hint {hintLevel}
      </div>

      {/* Level 1 — Strategy tip */}
      {currentHint.type === 'text' && (
        <div className="rounded-xl bg-white/10 p-3 text-sm leading-relaxed text-[#1a2a3a] font-bold">
          💡 {currentHint.content}
        </div>
      )}

      {/* Level 2 — Resulting equation + mini-question */}
      {currentHint.type === 'miniQuestion' && (
        <div className="rounded-xl bg-white/10 p-3 space-y-2">
          <p className="text-xs text-[#1a2a3a]/75 font-bold uppercase tracking-tight">
            {currentHint.intro}
          </p>
          <p className="font-display text-2xl text-[#1a2a3a] tracking-wide">
            {currentHint.resultEquation}
          </p>
          <p className="text-xs text-[#1a2a3a]/80 font-bold">{currentHint.prompt}</p>

          {!miniSolved ? (
            <div className="flex gap-2 pt-1">
              <input
                type="number"
                inputMode="numeric"
                value={miniHintAnswer}
                onChange={(e) => setMiniHintAnswer(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitMiniHintAnswer() }}
                className={`hide-number-spin flex w-24 rounded-xl border-2 border-[#1a2a3a]/15 bg-slate-950/35 px-3 py-2 text-base text-white outline-none ring-goldplay/70 transition focus:ring-4 ${shake ? 'animate-shakeSoft' : ''}`}
                placeholder="x = ?"
              />
              <button
                type="button"
                onClick={submitMiniHintAnswer}
                className="rounded-xl bg-goldplay px-4 py-2 font-display text-sm text-inkplay transition hover:scale-[1.02]"
              >
                Check
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-3 py-2 text-sm text-emerald-200 font-bold">
              ✅ {currentHint.successMessage}
            </div>
          )}
        </div>
      )}

      {/* Level 3 — Final answer reveal */}
      {currentHint.type === 'finalReveal' && (
        <div className="rounded-xl bg-goldplay/20 border border-goldplay/40 p-3 text-sm leading-relaxed text-[#1a2a3a] font-bold">
          🔑 {currentHint.content}
        </div>
      )}
    </div>
  )
}

export default HintPanel
