import { useState } from 'react'
import CryptexPanel from './CryptexPanel'

function PuzzleModal({ objectData, game }) {
  const [currentB, setCurrentB] = useState(objectData.puzzle.initialEquation.b)
  
  const isPhase1Complete = currentB === 0
  const originalB = objectData.puzzle.initialEquation.b
  const bAbs = Math.abs(originalB)
  const operation = originalB > 0 ? 'subtracting' : 'adding'
  return (
    <div className="puzzle-modal-overlay">
      <div className="puzzle-modal-container animate-popIn">
        <img
          src="/assets/Puzzle Popup Panel.png"
          alt="Puzzle panel"
          className="h-auto w-full object-contain shadow-2xl"
        />

        <div className="puzzle-content-area flex flex-col pt-4">
          <button
            type="button"
            onClick={game.closePuzzleModal}
            className="puzzle-close-btn"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Top Section Grid */}
          <div className="grid grid-cols-1 gap-6 px-12 lg:grid-cols-2">
            {/* Left: Equation Display */}
            <div className="flex flex-col items-start justify-center text-left mb-8">
              <div className="flex items-center gap-6">
                <div className="rounded-2xl bg-white/20 shadow-sm shrink-0">
                  <img
                    src={`/assets/${objectData.asset}`}
                    alt={objectData.label}
                    className="h-20 w-20 object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl text-inkplay leading-tight">
                    Solve for the key!
                  </h2>
                  <p className="text-sm text-inkplay/80">
                    {objectData.label} clue
                  </p>
                </div>
              </div>

              {/* Feedback Text Section (Moved to Left) */}
              {isPhase1Complete ? (
                <div className="mt-4  flex flex-col justify-center animate-fadeIn bg-white/20 rounded-lg p-4">
                  <p className="text-lg font-bold text-inkplay leading-tight">
                    -Succesfully removed constant by  {operation} {bAbs} <br />from both side.
                  </p>
                  <p className="text-base text-inkplay/70 font-semibold ">
                    -Now, Use operations below to isolate 'x'.
                  </p>
                </div>) : <div className='mt-10 h-[70px] '>
                  <p className='text-lg font-bold text-inkplay leading-tight bg-white/20 rounded-lg p-4'>Use the Cryptex below to simplify the steps...</p>
                </div> }
              
            </div>

            {/* Right: Answer Input + Submit Row */}
            <div className="flex flex-col items-start justify-center border-l border-inkplay/10 pl-10 text-left">
              {/* Equation Display (Moved from Left) */}
              <div className="mb-6 flex flex-col justify-center" style={{marginTop:"-40px"}}>
                <p className="text-base font-black uppercase tracking-[0.3rem] text-inkplay/70">
                  Equation:-
                </p>
                <p className="font-display text-7xl text-inkplay leading-tight drop-shadow-md">
                        {objectData.puzzle.question}
                </p>
                <p className="mt-2 text-lg text-inkplay/90 font-bold leading-snug">
                Enter your final answer here:
                </p>
              </div>

              <div style={{marginTop:"-30px"}} className="flex items-center gap-4">
                <label
                  className={`relative block h-16 w-32 shrink-0 ${game.wrongPulse ? 'animate-shakeSoft' : ''}`}
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
                    className={`hide-number-spin absolute inset-0 bg-transparent px-4 text-center font-display text-2xl text-inkplay outline-none ${game.puzzleAnswer && !game.wrongPulse ? 'animate-vibrateSuccess' : ''}`}
                    placeholder="?"
                  />
                </label>

                <button
                  type="button"
                  onClick={game.submitPuzzleAnswer}
                  className="asset-button relative h-24 w-44 shrink-0 text-center font-display text-[22px] text-white transition hover:scale-105 active:scale-95 cursor-pointer "
                  style={{ backgroundImage: 'url("/assets/submit_btn.png")', marginLeft:"-40px", marginTop:"9px" }}
                >
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full flex-col items-center px-8">
            {/* Cryptex Solver Section (Bottom Center) */}
            {objectData.puzzle.initialEquation && (
              <div className="w-full">
                <CryptexPanel
                  initialEquation={objectData.puzzle.initialEquation}
                  onCryptexSolved={(x) => {
                    game.setPuzzleAnswer(String(x))
                  }}
                  onStateChange={(eq) => setCurrentB(eq.b)}
                  onFlashFeedback={game.flashFeedback}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PuzzleModal
