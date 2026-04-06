import HintPanel from './HintPanel'

function PuzzleModal({ objectData, game }) {
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

          <div className="grid h-full max-h-[65vh] gap-3 overflow-hidden lg:grid-cols-[1fr_1fr]">
            <div className="puzzle-glass-panel flex flex-col justify-center p-3">
              <p className="text-[10px] uppercase tracking-[0.2rem] text-inkplay/70">Equation</p>
              <p className="mt-1 font-display text-xl text-inkplay">
                {objectData.puzzle.question}
              </p>
              <p className="mt-1 text-sm text-inkplay/80 font-bold">
                Solve for x and type your answer.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  className={`relative block h-12 w-full max-w-[180px] ${game.wrongPulse ? 'animate-shakeSoft' : ''}`}
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
                      if (e.key === 'Enter') {
                        game.submitPuzzleAnswer()
                      }
                    }}
                    className="hide-number-spin absolute inset-0 bg-transparent px-6 text-center font-display text-lg text-inkplay outline-none"
                    placeholder="?"
                  />
                </label>

                <button
                  type="button"
                  onClick={game.submitPuzzleAnswer}
                  className="asset-button relative h-12 w-32 shrink-0 text-center font-display text-base text-white transition hover:scale-105"
                  style={{ backgroundImage: 'url("/assets/Submit Button.png")' }}
                >
                  Submit
                </button>
              </div>

              <div className="mt-auto pt-3 text-[11px] text-inkplay/90 italic">
                Digits collection for Code.
              </div>
            </div>

            <div className="puzzle-glass-panel flex flex-col bg-slate-900/60 p-3 text-white shadow-inner">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm sm:text-base">Hint Helper</h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={game.revealHints}
                    className="asset-button h-10 w-20 transition hover:scale-105"
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

              <div className="mt-2 flex-grow overflow-auto">
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
