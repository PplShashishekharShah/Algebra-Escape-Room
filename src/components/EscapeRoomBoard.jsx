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
          src="/assets/Background Escape Room.png"
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1 sm:gap-2">
                {game.collectedDigits.map((digit, index) => (
                  <div key={index} className="relative h-24 w-24 sm:h-12 sm:w-10">
                    <img
                      src="/assets/Number Slot (Empty).png"
                      alt=""
                      className="h-full w-full object-contain opacity-90"
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-sm text-white sm:text-lg">
                      {digit ?? '?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </button>

        </div>
      </div>
    </section>
  )
}

export default EscapeRoomBoard
