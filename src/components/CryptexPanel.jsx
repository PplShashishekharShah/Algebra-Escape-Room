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

  const [isApplied, setIsApplied] = useState(false)
  
  /* Scroll handlers: ▲ adds 1, ▼ subtracts 1 from b (and c) */
  function handleScrollUp()   { 
    if (isApplied) return
    const result = applyAdd(+1) 
    if (result?.error && onFlashFeedback) onFlashFeedback(result.error, 'error')
  }
  function handleScrollDown() { 
    if (isApplied) return
    const result = applyAdd(-1) 
    if (result?.error && onFlashFeedback) onFlashFeedback(result.error, 'error')
  }

  function handleDivide(factor) {
    if (isApplied) return
    const result = applyDivide(factor)
    if (result?.error && onFlashFeedback) {
      onFlashFeedback(result.error, 'error')
    }
  }

  function handleMultiply(factor) {
    if (isApplied) return
    applyMultiply(factor)
  }

  function handleApply() {
    if (isApplied) return
    
    // Vibration effect
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
    
    setIsApplied(true)
    onCryptexSolved(c)
  }

  return (
    <div className="cryptex-panel">
      {/* Removed Redundant Equation Display */}
      

      <div className="cryptex-main-layout flex flex-col items-center justify-center gap-8">
        <div className={`cryptex-content-group ${isSolved ? 'cryptex-content-group--solved' : ''}`}>
          {/* ── Drum bars (Left) ────────────────────── */}
          <div className="cryptex-frame-wrapper">
            <div className="cryptex-bars-container">
              {bars.map((bar) => (
                <CryptexBar
                  key={bar.key}
                  symbol={bar.symbol}
                  isLocked={bar.isLocked}
                  onScrollUp={bar.key === 'const' && !isApplied ? handleScrollUp : undefined}
                  onScrollDown={bar.key === 'const' && !isApplied ? handleScrollDown : undefined}
                />
              ))}
            </div>
          </div>

          {/* ── Operation buttons (Right Side) ─────────── */}
          <div className="cryptex-op-sidebar flex flex-col gap-4">
            <p className="text-xl text-center font-black text-[#222] uppercase tracking-[0.35em] mb-2 drop-shadow-md">Operations</p>
            <div className="grid grid-cols-2 gap-3">
              <button disabled={isApplied} type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(2)}>x2</button>
              <button disabled={isApplied} type="button" className="cryptex-op-btn cryptex-op-btn--mul" onClick={() => handleMultiply(3)}>x3</button>
              <button disabled={isApplied} type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(2)}>÷2</button>
              <button disabled={isApplied} type="button" className="cryptex-op-btn cryptex-op-btn--div" onClick={() => handleDivide(3)}>÷3</button>
              <button 
                type="button" 
                className="cryptex-op-btn cryptex-op-btn--undo col-span-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none" 
                onClick={undo}
                disabled={history.length === 0 || isApplied}
              >
                Undo
              </button>
            </div>
          </div>
        </div>

        {/* ── Apply Answer (Right or Overlay when solved) ────────────── */}
        {isSolved && (
          <div className="flex flex-col items-center justify-center p-12">
            <button
              type="button"
              className={`cryptex-apply-btn shadow-lg ${isApplied ? 'opacity-50 grayscale pointer-events-none' : 'animate-bounceSoft'}`}
              onClick={handleApply}
              disabled={isApplied}
            >
              {isApplied ? `Applied x = ${c}` : `Apply Answer → fill x = ${c}`}
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
