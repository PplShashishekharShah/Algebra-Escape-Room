import { useState } from 'react'
import CryptexBar from './CryptexBar'
import { useCryptexEngine } from '../hooks/useCryptexEngine'

/* ─── helpers ─────────────────────────────────────────── */

function formatEquation({ a, b, c }) {
  const xTerm = a === 1 ? 'x' : `${a}x`
  if (b === 0) return `${xTerm} = ${c}`
  if (b > 0) return `${xTerm} + ${b} = ${c}`
  return `${xTerm} − ${Math.abs(b)} = ${c}`
}

function getGuidance({ a, b }) {
  if (b > 0) return `💡 Press ▼ on the constant to subtract ${b} from both sides`
  if (b < 0) return `💡 Press ▲ on the constant to add ${Math.abs(b)} to both sides`
  if (a !== 1) return `💡 Now use a ÷ button to divide both sides by ${a}`
  return `🎉 You isolated x — apply your answer!`
}

/* ─── component ───────────────────────────────────────── */

function CryptexPanel({ hint, onCryptexSolved }) {
  const [divError, setDivError] = useState(null)
  const engine = useCryptexEngine(hint.initialEquation)
  const { equation, isSolved, history, applyAdd, applyDivide, applyMultiply, undo } = engine
  const { a, b, c } = equation

  /* Build the 7 bars */
  const sign    = b >= 0 ? '+' : '−'
  const absB    = Math.abs(b)
  const tensC   = Math.floor(Math.abs(c) / 10)
  const onesC   = Math.abs(c) % 10

  const bars = [
    { key: 'coeff',    symbol: String(a),      isLocked: true  },
    { key: 'x',        symbol: 'x',            isLocked: true  },
    { key: 'sign',     symbol: sign,           isLocked: true  },
    { key: 'const',    symbol: String(absB),   isLocked: false },
    { key: 'eq',       symbol: '=',            isLocked: true  },
    { key: 'rhs-tens', symbol: String(tensC),  isLocked: true  },
    { key: 'rhs-ones', symbol: String(onesC),  isLocked: true  },
  ]

  /* Scroll handlers: ▲ adds 1, ▼ subtracts 1 from b (and c) */
  function handleScrollUp()   { applyAdd(+1); setDivError(null) }
  function handleScrollDown() { applyAdd(-1); setDivError(null) }

  function handleDivide(factor) {
    const result = applyDivide(factor)
    if (result?.error) {
      setDivError(result.error)
      setTimeout(() => setDivError(null), 3500)
    } else {
      setDivError(null)
    }
  }

  function handleMultiply(factor) {
    applyMultiply(factor)
    setDivError(null)
  }

  return (
    <div className="cryptex-panel">

      {/* ── Live equation display ─────────────────── */}
      <div className="cryptex-equation-display">
        <span key={formatEquation(equation)} className="cryptex-eq-text">
          {formatEquation(equation)}
        </span>
      </div>

      {/* ── Drum bars (hidden when solved) ───────── */}
      {!isSolved && (
        <div className="cryptex-frame-wrapper">
          <div className="cryptex-bars-container">
            {bars.map((bar) => (
              <CryptexBar
                key={bar.key}
                symbol={bar.symbol}
                isLocked={bar.isLocked}
                onScrollUp={bar.key === 'const' ? handleScrollUp : undefined}
                onScrollDown={bar.key === 'const' ? handleScrollDown : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Operation buttons ─────────────────────── */}
      {!isSolved && (
        <div className="cryptex-op-buttons">
          <button type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(2)}>×2</button>
          <button type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(3)}>×3</button>
          <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(2)}>÷2</button>
          <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(3)}>÷3</button>
          <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(4)}>÷4</button>
          {history.length > 0 && (
            <button type="button" className="cryptex-op-btn cryptex-op-btn--undo" onClick={undo}>↩ Undo</button>
          )}
        </div>
      )}

      {/* ── Divide error feedback ─────────────────── */}
      {divError && (
        <div className="cryptex-error" role="alert">⚠️ {divError}</div>
      )}

      {/* ── Guidance text ─────────────────────────── */}
      {!isSolved && (
        <p className="cryptex-guidance">{getGuidance(equation)}</p>
      )}

      {/* ── Apply Answer (solved only) ────────────── */}
      {isSolved && (
        <button
          type="button"
          className="cryptex-apply-btn"
          onClick={() => onCryptexSolved(c)}
        >
          Apply Answer → fill x = {c}
        </button>
      )}
    </div>
  )
}

export default CryptexPanel
