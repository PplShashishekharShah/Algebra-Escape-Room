import HintPanel from './HintPanel'

function PuzzleModal({ objectData, game }) {
  // Next arrow enabled: we have a hint shown, not yet at level 3,
  // and if current hint is a miniQuestion it must be solved first
  const nextArrowEnabled =
    game.hintProgress.level > 0 &&
    game.hintProgress.level < 3 &&
    (game.currentHint?.type !== 'miniQuestion' || game.hintProgress.miniSolved)

  return (
    <div className="puzzle-modal-overlay">
      <div className="puzzle-modal-container animate-popIn">
        <img
          src="/assets/Puzzle Popup Panel.png"
          alt="Puzzle panel"
          className="h-auto w-full object-contain"
        />

        <div className="puzzle-content-area">
          <button
            type="button"
            onClick={game.closePuzzleModal}
            className="puzzle-close-btn"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2 shadow-sm">
                <img
                  src={`/assets/${objectData.asset}`}
                  alt={objectData.label}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg text-inkplay leading-tight">
                  Solve the equation to get the key!
                </h2>
                <p className="truncate text-sm text-inkplay/80">
                  {objectData.label} clue
                </p>
              </div>
            </div>
          </div>

          <div className="grid h-full max-h-[65vh] gap-4 overflow-hidden lg:grid-cols-[40%_60%]">
            {/* Left — equation + answer input */}
            <div className="puzzle-glass-panel flex flex-col p-4 ">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.2rem] text-inkplay/70">Equation</p>
                <p className="mt-1 font-display text-2xl text-inkplay leading-tight">
                  {objectData.puzzle.question}
                </p>
                <p className="mt-2 text-sm text-inkplay/85 font-bold leading-snug">
                  Solve for x and enter your answer.
                </p>
              </div>

              <div className="flex">
                <label
                  className={`relative block h-14 w-full max-w-[100px] shrink-0 ${game.wrongPulse ? 'animate-shakeSoft' : ''}`}
                >
                  <img
                    src="/assets/Input Box.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={game.puzzleAnswer}
                    onChange={(event) => game.setPuzzleAnswer(event.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') game.submitPuzzleAnswer()
                    }}
                    className="hide-number-spin absolute inset-0 bg-transparent px-6  text-center font-display text-xl text-inkplay outline-none"
                    placeholder="?"
                  />
                </label>

                <button
                  type="button"
                  onClick={game.submitPuzzleAnswer}
                  className="asset-button relati4e h-14 w-full max-w-[160px] shrink-0 text-center font-display text-lg text-white transition hover:scale-105 active:scale-95"
                  style={{ backgroundImage: 'url("/assets/Submit Button.png")' }}
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Right — hints */}
            <div className="puzzle-glass-panel flex flex-col bg-slate-900/60 p-2 text-white shadow-inner">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm sm:text-base">Hint Helper</h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={game.revealHints}
                    className="asset-button h-10 w-16 transition hover:scale-105"
                    style={{ backgroundImage: 'url("/assets/Hint Button.png")' }}
                    aria-label="Open hints"
                  />

                  <button
                    type="button"
                    disabled={!nextArrowEnabled}
                    onClick={game.goToNextHint}
                    className={`asset-button h-10 w-12 transition ${
                      nextArrowEnabled ? 'hover:scale-105' : 'cursor-not-allowed opacity-60'
                    }`}
                    style={{
                      backgroundImage: `url("/assets/${
                        nextArrowEnabled ? 'Next Arrow Button.png' : 'Disabled Arrow Button.png'
                      }")`,
                    }}
                    aria-label="Next hint"
                  />
                </div>
              </div>

              <div className="mt-2 flex-grow ">
                <HintPanel
                  currentHint={game.currentHint}
                  hintLevel={game.hintProgress.level}
                  miniHintAnswer={game.miniHintAnswer}
                  setMiniHintAnswer={game.setMiniHintAnswer}
                  submitMiniHintAnswer={game.submitMiniHintAnswer}
                  miniSolved={game.hintProgress.miniSolved}
                  shake={game.wrongPulse}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PuzzleModal
