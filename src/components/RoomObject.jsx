function RoomObject({
  objectData,
  isTarget,
  isSolved,
  onClick,
  celebration,
  width,
  height,
}) {
  const left = `${(objectData.position.x / 1536) * 100}%`
  const top = `${(objectData.position.y / 1024) * 100}%`

  return (
    <button
      type="button"
      onClick={() => onClick(objectData.id)}
      className={`room-object-btn group clue-${objectData.id}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      aria-label={objectData.label}
    >
      {/* Glow effect removed per user request to avoid giving hints */}

      {celebration ? (
        <img
          src="/assets/Success Sparkle.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-0 w-24 -translate-x-1/2 -translate-y-1/2 animate-sparkle object-contain"
        />
      ) : null}

      <img
        src={`/assets/${objectData.asset}`}
        alt={objectData.label}
        className={`room-object-img ${isSolved ? 'room-object-solved' : ''}`}
      />

      {isSolved ? (
        <div className="pointer-events-none absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-transparent shadow-lg ring-4 ring-white/80">
          <img
            src="/assets/Key (Reward Asset).png"
            alt=""
            className="h-9 w-9 object-contain"
          />
        </div>
      ) : null}
    </button>
  )
}

export default RoomObject
