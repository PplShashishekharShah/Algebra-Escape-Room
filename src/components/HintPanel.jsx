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
      <div className="mt-2 rounded-[1.25rem] border border-dashed border-black/35 bg-black/5 p-3 text-sm text-black/85">
        Need a nudge? Tap the hint button to reveal the first clue.
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-2 overflow-y-auto max-h-[30vh]">
      <div className="inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-goldplay font-bold">
        Hint Level {hintLevel}
      </div>

      {currentHint.type === 'text' ? (
        <div className="rounded-xl bg-white/10 p-3 text-sm leading-relaxed text-[#1a2a3a] font-bold">
          {currentHint.content}
        </div>
      ) : null}

      {currentHint.type === 'miniQuestion' ? (
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-[#1a2a3a]/80 font-bold uppercase tracking-tight">Mini-question</p>
          <p className="mt-1 font-display text-xl text-[#1a2a3a]">{currentHint.question}</p>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              inputMode="numeric"
              value={miniHintAnswer}
              onChange={(event) => setMiniHintAnswer(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitMiniHintAnswer()
                }
              }}
              className={`hide-number-spin w-full rounded-xl border-2 border-[#1a2a3a]/15 bg-slate-950/35 px-3 py-2 text-base text-white outline-none ring-goldplay/70 transition focus:ring-4 ${
                shake && !miniSolved ? 'animate-shakeSoft' : ''
              }`}
              placeholder="?"
            />
            <button
              type="button"
              onClick={submitMiniHintAnswer}
              className="rounded-xl bg-goldplay px-4 py-2 font-display text-sm text-inkplay transition hover:scale-[1.02]"
            >
              Check
            </button>
          </div>

          <p className="mt-2 text-xs text-[#1a2a3a]/80 font-bold italic">
            {miniSolved
              ? 'Great! The next hint is ready.'
              : 'Solve this to move forward.'}
          </p>
        </div>
      ) : null}

      {currentHint.type === 'stepReveal' ? (
        <div className="rounded-xl bg-mintplay/20 p-3 text-sm leading-relaxed text-[#1a2a3a] font-bold">
          {currentHint.content}
        </div>
      ) : null}
    </div>
  )
}

export default HintPanel
