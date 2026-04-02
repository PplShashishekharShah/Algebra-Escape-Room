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

        <div className="absolute inset-[9%_7%_11%_7%] flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/60 p-2 shadow-md">
                <img
                  src={`/assets/${objectData.asset}`}
                  alt={objectData.label}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              </div>
              <div>
                <h2 className="font-display text-lg text-inkplay sm:text-xl">
                  Solve the equation to get the key!
                </h2>
                <p className="text-xs text-inkplay/80 sm:text-sm">
                  {objectData.label} clue
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={game.closePuzzleModal}
              className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-semibold text-inkplay shadow"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.95fr]">
            <div className="rounded-[1.5rem] bg-white/75 p-3 shadow-md sm:p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-inkplay/70">Equation</p>
              <p className="mt-1 font-display text-2xl text-inkplay sm:text-3xl">
                {objectData.puzzle.question}
              </p>
              <p className="mt-2 text-xs text-inkplay/80 sm:text-sm">
                Solve for <span className="font-bold">x</span> and type your answer.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  className={`relative block h-16 w-full max-w-xs ${game.wrongPulse ? 'animate-shakeSoft' : ''}`}
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
                    className="hide-number-spin absolute inset-0 bg-transparent px-8 text-center font-display text-xl text-inkplay outline-none"
                    placeholder="?"
                  />
                </label>

                <button
                  type="button"
                  onClick={game.submitPuzzleAnswer}
                  className="asset-button relative h-14 w-40 shrink-0 text-center font-display text-lg text-white transition hover:scale-105"
                  style={{ backgroundImage: 'url("/assets/Submit Button.png")' }}
                >
                  Submit
                </button>
              </div>

              <div className="mt-3 rounded-xl bg-goldplay/20 px-3 py-2 text-xs text-inkplay sm:text-sm">
                Digits collected unlock the final door code. You can answer anytime.
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-slate-900/80 p-3 text-white shadow-md sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg">Hint Helper</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={game.revealHints}
                    className="asset-button h-12 w-24 transition hover:scale-105"
                    style={{ backgroundImage: 'url("/assets/Hint Button.png")' }}
                    aria-label="Open hints"
                  />

                  <button
                    type="button"
                    disabled={!nextArrowEnabled}
                    onClick={game.goToNextHint}
                    className={`asset-button h-12 w-16 transition ${
                      nextArrowEnabled ? 'hover:scale-105' : 'cursor-not-allowed opacity-75'
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
  )
}

export default PuzzleModal
