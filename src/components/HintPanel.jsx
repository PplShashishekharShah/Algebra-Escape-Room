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
      <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/35 bg-white/5 p-4 text-sm text-white/85">
        Need a nudge? Tap the hint button to reveal the first clue.
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-goldplay">
        Hint Level {hintLevel}
      </div>

      {currentHint.type === 'text' ? (
        <div className="rounded-[1.25rem] bg-white/10 p-4 text-sm leading-relaxed text-white sm:text-base">
          {currentHint.content}
        </div>
      ) : null}

      {currentHint.type === 'miniQuestion' ? (
        <div className="rounded-[1.25rem] bg-white/10 p-4">
          <p className="text-sm text-white/80">Mini-question</p>
          <p className="mt-2 font-display text-2xl text-white">{currentHint.question}</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              inputMode="numeric"
              value={miniHintAnswer}
              onChange={(event) => setMiniHintAnswer(event.target.value)}
              className={`hide-number-spin w-full rounded-2xl border-2 border-white/15 bg-slate-950/35 px-4 py-3 text-lg text-white outline-none ring-goldplay/70 transition focus:ring-4 ${
                shake && !miniSolved ? 'animate-shakeSoft' : ''
              }`}
              placeholder="Your answer"
            />
            <button
              type="button"
              onClick={submitMiniHintAnswer}
              className="rounded-2xl bg-goldplay px-4 py-3 font-display text-lg text-inkplay transition hover:scale-[1.02]"
            >
              Check
            </button>
          </div>

          <p className="mt-3 text-sm text-white/80">
            {miniSolved
              ? 'Great thinking! The next hint is ready.'
              : 'Solve this mini-question to unlock the next step.'}
          </p>
        </div>
      ) : null}

      {currentHint.type === 'stepReveal' ? (
        <div className="rounded-[1.25rem] bg-mintplay/20 p-4 text-sm leading-relaxed text-white sm:text-base">
          {currentHint.content}
        </div>
      ) : null}
    </div>
  )
}

export default HintPanel
