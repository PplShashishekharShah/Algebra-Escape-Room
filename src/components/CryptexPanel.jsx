import { useState } from 'react'
import CryptexBar from './CryptexBar'
import { useCryptexEngine } from '../hooks/useCryptexEngine'

/* ─── helpers ─────────────────────────────────────────── */

function formatEquation({ a, b, c }) {
  let xTerm = ''
  if (a === 1) xTerm = 'x'
  else if (a < 1) xTerm = `x / ${Math.round(1/a)}`
  else xTerm = `${a}x`

  if (b === 0) return `${xTerm} = ${c}`
  if (b > 0) return `${xTerm} + ${b} = ${c}`
  return `${xTerm} − ${Math.abs(b)} = ${c}`
}

function getGuidance({ a, b }) {
  if (b > 0) return `💡 Press ▼ on the constant to subtract ${b} from both sides`
  if (b < 0) return `💡 Press ▲ on the constant to add ${Math.abs(b)} to both sides`
  if (a !== 1) {
    const op = a < 1 ? 'multiply' : 'divide'
    const factor = a < 1 ? Math.round(1/a) : a
    const symbol = a < 1 ? '×' : '÷'
    return `💡 Now use a ${symbol} button to ${op} both sides by ${factor}`
  }
  return `🎉 You isolated x — apply your answer!`
}

function CryptexPanel({ initialEquation, onCryptexSolved, onFlashFeedback }) {
  const engine = useCryptexEngine(initialEquation)
  const { equation, isSolved, history, applyAdd, applyDivide, applyMultiply, undo } = engine
  const { a, b, c } = equation

  /* Build dynamic 7 bars based on equation structure */
  const sign = b >= 0 ? '+' : '−'
  const absB = Math.abs(b)
  
  let bars = []
  if (a < 1) {
    // Structure: [x] [/] [2] [+] [3] [=] [7]
    const denom = Math.round(1/a)
    bars = [
      { key: 'x',        symbol: 'x',            isLocked: true },
      { key: 'div',      symbol: '/',            isLocked: true },
      { key: 'denom',    symbol: String(denom),  isLocked: true },
      { key: 'sign',     symbol: sign,           isLocked: true },
      { key: 'const',    symbol: String(absB),   isLocked: false },
      { key: 'eq',       symbol: '=',            isLocked: true },
      { key: 'rhs',      symbol: String(c),      isLocked: true },
    ]
  } else {
    // Structure: [3] [x] [+] [5] [=] [2] [0] 
    // If c is single digit, we might shift or pad. Let's stick to c as one or two bars.
    const tensC = Math.floor(Math.abs(c) / 10)
    const onesC = Math.abs(c) % 10
    
    bars = [
      { key: 'coeff',    symbol: a === 1 ? '' : String(a), isLocked: true },
      { key: 'x',        symbol: 'x',            isLocked: true },
      { key: 'sign',     symbol: sign,           isLocked: true },
      { key: 'const',    symbol: String(absB),   isLocked: false },
      { key: 'eq',       symbol: '=',            isLocked: true },
      { key: 'rhs-tens', symbol: tensC > 0 ? String(tensC) : ' ', isLocked: true },
      { key: 'rhs-ones', symbol: String(onesC),  isLocked: true },
    ]
  }

  /* Scroll handlers: ▲ adds 1, ▼ subtracts 1 from b (and c) */
  function handleScrollUp()   { applyAdd(+1) }
  function handleScrollDown() { applyAdd(-1) }

  function handleDivide(factor) {
    const result = applyDivide(factor)
    if (result?.error && onFlashFeedback) {
      onFlashFeedback(result.error, 'error')
    }
  }

  function handleMultiply(factor) {
    applyMultiply(factor)
  }

  return (
    <div className="cryptex-panel">
      {/* ── Live equation display ─────────────────── */}
      <div className="cryptex-equation-display">
        <span key={formatEquation(equation)} className="cryptex-eq-text">
          {formatEquation(equation)}
        </span>
      </div>

      <div className="cryptex-main-layout flex flex-col items-center justify-center gap-8">
        <div className={`cryptex-content-group ${isSolved ? 'cryptex-content-group--solved' : ''}`}>
          {/* ── Operation buttons (Left Side) ─────────── */}
          <div className="cryptex-op-sidebar flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(2)}>×2</button>
              <button type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(3)}>×3</button>
              <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(2)}>÷2</button>
              <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(3)}>÷3</button>
              <button type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(4)}>÷4</button>
              {history.length > 0 && (
                <button type="button" className="cryptex-op-btn cryptex-op-btn--undo" onClick={undo}>↩</button>
              )}
            </div>
            <p className="text-[10px] text-center font-bold text-white/50 uppercase tracking-widest">Operations</p>
          </div>

          {/* ── Drum bars (Center) ────────────────────── */}
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
        </div>

        {/* ── Apply Answer (Right or Overlay when solved) ────────────── */}
        {isSolved && (
          <div className="flex flex-col items-center justify-center p-12">
            <button
              type="button"
              className="cryptex-apply-btn animate-bounceSoft shadow-lg"
              onClick={() => onCryptexSolved(c)}
            >
              Apply Answer → fill x = {c}
            </button>
            <p className="mt-4 text-white font-display text-xl">Equation Solved!</p>
          </div>
        )}
      </div>

      {/* ── Guidance ───────────────────── */}
      <div className="mt-4 flex flex-col items-center">
        {!isSolved && (
          <p className="cryptex-guidance">{getGuidance(equation)}</p>
        )}
      </div>
    </div>
  )
}

export default CryptexPanel
