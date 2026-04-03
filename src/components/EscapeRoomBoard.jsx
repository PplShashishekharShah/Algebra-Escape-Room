import RoomObject from './RoomObject'

const objectScale = {
  book: { width: 164, height: 100 },
  box: { width: 186, height: 124 },
  envelope: { width: 136, height: 90 },
}

function EscapeRoomBoard({ level, game }) {
  return (
    <section className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-slate-950">
      <div className="relative h-full w-full">
        <img
          src="/assets/Background Escape Room_2.png"
          alt="Escape room background"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0">
          {level.objects.map((objectData) => {
            const size = objectScale[objectData.id]

            return (
              <RoomObject
                key={objectData.id}
                objectData={objectData}
                isTarget={game.currentTargetObject?.id === objectData.id}
                isSolved={game.solvedObjects[objectData.id]}
                onClick={game.handleObjectClick}
                celebration={game.celebrationObjectId === objectData.id}
                width={size.width}
                height={size.height}
              />
            )
          })}

          <button
            type="button"
            onClick={game.openDoorPanel}
            className={`door-lock-button ${
              game.doorUnlocked
                ? 'unlocked'
                : game.collectedDigits.every((digit) => digit !== null)
                  ? 'ready'
                  : ''
            }`}
            aria-label="Door lock"
          >
            {/* Slots removed from door per user request */}
          </button>
        </div>

        {/* In-game Victory Animation / Banner */}
        {game.gameCompleted && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="relative overflow-hidden rounded-3xl border-4 border-goldplay bg-white/95 p-12 text-center shadow-[0_0_50px_rgba(199,149,44,0.5)] animate-popIn">
              {/* Confetti-like background particles */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 h-2 w-2 bg-blue-500 animate-bounce" />
                <div className="absolute top-1/4 right-1/4 h-3 w-3 bg-red-500 animate-pulse" />
                <div className="absolute bottom-1/4 left-1/3 h-2 w-2 bg-yellow-500 animate-bounce" />
              </div>

              <span className="text-xs uppercase tracking-[0.4em] text-inkplay/60 font-extrabold">
                Mission Complete
              </span>
              <h2 className="mt-4 font-display text-5xl text-inkplay">
                You Escaped!
              </h2>
              <p className="mt-4 text-xl font-medium text-inkplay/80">
                Brilliant work. You've cracked every code.
              </p>
              
              <button
                type="button"
                onClick={game.resetGame}
                className="mt-8 rounded-full bg-goldplay px-10 py-4 font-display text-2xl text-inkplay transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EscapeRoomBoard
