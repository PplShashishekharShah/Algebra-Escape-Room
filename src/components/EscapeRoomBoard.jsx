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
            {/* Slots removed from door per user request */}
          </button>

        </div>
      </div>
    </section>
  )
}

export default EscapeRoomBoard
