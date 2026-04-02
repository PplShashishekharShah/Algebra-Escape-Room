function SuccessOverlay({ onReplay }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="animate-popIn relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white px-6 py-8 text-center shadow-soft">
        <img
          src="/assets/Success Sparkle.png"
          alt=""
          className="absolute left-1/2 top-4 w-28 -translate-x-1/2 animate-pulseGlow object-contain"
        />
        <div className="relative z-10">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-jam">Mission Complete</p>
          <h2 className="mt-8 font-display text-4xl text-inkplay sm:text-5xl">
            You escaped the room!
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-inkplay/75 sm:text-lg">
            Brilliant algebra work. You solved every clue, collected every key digit, and unlocked the door.
          </p>
          <button
            type="button"
            onClick={onReplay}
            className="mt-8 rounded-full bg-goldplay px-8 py-4 font-display text-xl text-inkplay shadow transition hover:-translate-y-0.5 hover:scale-[1.01]"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessOverlay
