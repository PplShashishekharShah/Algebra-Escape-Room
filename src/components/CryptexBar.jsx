function CryptexBar({ symbol, isLocked, onScrollUp, onScrollDown }) {
  /* Mechanical click sound effect using Web Audio API */
  const playClick = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(70, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) { /* ignore sound errors if blocked by browser */ }
  }

  const handleUp = () => {
    playClick()
    onScrollUp()
  }

  const handleDown = () => {
    playClick()
    onScrollDown()
  }

  return (
    <div className={`cryptex-bar ${isLocked ? 'cryptex-bar--locked' : 'cryptex-bar--active'}`}>
      {/* Up button — only for active bars */}
      {!isLocked && (
        <button
          type="button"
          className="cryptex-nav-btn cryptex-nav-btn--up"
          onClick={handleUp}
          aria-label="Increase"
        >
          <img src="/assets/green_up.png" alt="+" className="h-6 w-6 object-contain" />
        </button>
      )}

      {/* Drum face */}
      <div className="cryptex-drum-frame">
        <span key={symbol} className="cryptex-drum-symbol text-white drop-shadow-md">
          {symbol}
        </span>
      </div>

      {/* Down button — only for active bars */}
      {!isLocked && (
        <button
          type="button"
          className="cryptex-nav-btn cryptex-nav-btn--down"
          onClick={handleDown}
          aria-label="Decrease"
        >
          <img src="/assets/red_down.png" alt="−" className="h-6 w-6 object-contain" />
        </button>
      )}
    </div>
  )
}

export default CryptexBar
