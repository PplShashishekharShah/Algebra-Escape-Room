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
            <div className="door-slot-container">
              <div className="flex gap-1 sm:gap-1.5">
                {game.collectedDigits.map((digit, index) => (
                  <div key={index} className="relative h-10 w-8 sm:h-16 sm:w-14">
                    <img
                      src="/assets/Number Slot (Empty).png"
                      alt=""
                      className="h-full w-full object-contain opacity-90 shadow-sm"
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-base text-white sm:text-2xl">
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
