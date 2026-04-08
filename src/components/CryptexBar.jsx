/**
 * CryptexBar — a single vertical drum column.
 *
 * Props:
 *   symbol     — string to display (e.g. "5", "x", "+", "=")
 *   isLocked   — bool; locked bars show no arrows
 *   onScrollUp / onScrollDown — callbacks (only called when !isLocked)
 */
function CryptexBar({ symbol, isLocked, onScrollUp, onScrollDown }) {
  return (
    <div className={`cryptex-bar ${isLocked ? 'cryptex-bar--locked' : 'cryptex-bar--active'}`}>
      {/* Up button — only for active bars */}
      {!isLocked && (
        <button
          type="button"
          className="cryptex-arrow"
          onClick={onScrollUp}
          aria-label="Increase"
        >
          +
        </button>
      )}

      {/* Drum face */}
      <div className="cryptex-drum-frame">
        {/* key=symbol triggers CSS re-animation on every change */}
        <span key={symbol} className="cryptex-drum-symbol">
          {symbol}
        </span>
      </div>

      {/* Down button — only for active bars */}
      {!isLocked && (
        <button
          type="button"
          className="cryptex-arrow"
          onClick={onScrollDown}
          aria-label="Decrease"
        >
          -
        </button>
      )}
    </div>
  )
}

export default CryptexBar
