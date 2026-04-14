import { useState, useEffect } from 'react'
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
    return `💡 Now use a ${symbol} pin to ${op} both sides by ${factor}`
  }
  return `🎉 You isolated x — apply your answer!`
}

/* ─── Operator Pin component ───────────────────────────── */
/* The pin image has: oval face (left), pin stem → cylinder cap (right).
   We rotate it 180° so the oval face is on the RIGHT side of the pin,
   pointing INTO the cryptex from the left. */

function playMechanicalClick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(60, ctx.currentTime)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch (e) { /* ignore sound errors if blocked by browser */ }
}

function playSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    
    // Play a rising chime
    const playNote = (freq, time, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.1, time + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration)
      osc.start(time)
      osc.stop(time + duration)
    }
    
    const now = ctx.currentTime
    playNote(440, now, 0.5) // A4
    playNote(554.37, now + 0.1, 0.5) // C#5
    playNote(659.25, now + 0.2, 0.5) // E5
    playNote(880, now + 0.3, 0.8) // A5
  } catch (e) { }
}

function OperatorPin({ label, onClick, disabled, colorClass, tooltip }) {
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (disabled || pressed) return
    playMechanicalClick()
    setPressed(true)
    setTimeout(() => setPressed(false), 200)
    onClick()
  }

  return (
    <div className={`operator-pin-wrapper ${colorClass} ${disabled ? 'operator-pin--disabled' : ''} ${pressed ? 'operator-pin--pressed' : ''}`}>
      {/* Visual Pin image — rotated 180° */}
      <img
        src="/assets/operator_pin.png"
        alt=""
        className="operator-pin__img"
      />
      
      {/* Label overlaid on the oval face */}
      <span className="operator-pin__label">{label}</span>

      {/* HITBOX BUTTON - Positioned exactly over the oval head */}
      <button
        type="button"
        className="operator-pin__hitbox"
        onClick={handleClick}
        disabled={disabled || pressed}
        title={tooltip}
        aria-label={tooltip}
      />
    </div>
  )
}

function CryptexPanel({ initialEquation, onCryptexSolved, onFlashFeedback, onStateChange }) {
  const engine = useCryptexEngine(initialEquation)
  const { equation, isSolved, history, applyAdd, applyDivide, applyMultiply, undo } = engine
  const { a, b, c } = equation

  // Notify parent of state changes (for feedback text)
  useEffect(() => {
    if (onStateChange) onStateChange(equation)
  }, [equation, onStateChange])

  /* Build dynamic bars based on equation structure */
  const [showSimplified, setShowSimplified] = useState(b === 0)
  const [isVanishing, setIsVanishing] = useState(false)

  useEffect(() => {
    if (b === 0 && !showSimplified) {
      // Transition from complex to simplified
      setIsVanishing(true)
      const timer = setTimeout(() => {
        setShowSimplified(true)
        setIsVanishing(false)
      }, 500)
      return () => clearTimeout(timer)
    } else if (b !== 0) {
      setShowSimplified(false)
    }
  }, [b, showSimplified])

  const sign = b >= 0 ? '+' : '−'
  const absB = Math.abs(b)
  
  let bars = []
  if (a < 1) {
    // Structure: [x] [/] [2] [+] [3] [=] [7]
    const denom = Math.round(1/a)
    if (showSimplified) {
      // Simplified: [x] [/] [2] [=] [7]
      bars = [
        { key: 'x',        symbol: 'x',            isLocked: true },
        { key: 'div',      symbol: '/',            isLocked: true },
        { key: 'denom',    symbol: String(denom),  isLocked: true },
        { key: 'eq',       symbol: '=',            isLocked: true },
        { key: 'rhs',      symbol: String(c),      isLocked: true },
      ]
    } else {
      bars = [
        { key: 'x',        symbol: 'x',            isLocked: true },
        { key: 'div',      symbol: '/',            isLocked: true },
        { key: 'denom',    symbol: String(denom),  isLocked: true },
        { key: 'sign',     symbol: sign,           isLocked: true, className: isVanishing ? 'cryptex-bar-vanishing' : '' },
        { key: 'const',    symbol: String(absB),   isLocked: false, className: isVanishing ? 'cryptex-bar-vanishing' : '' },
        { key: 'eq',       symbol: '=',            isLocked: true },
        { key: 'rhs',      symbol: String(c),      isLocked: true },
      ]
    }
  } else {
    // Structure: [3] [x] [+] [5] [=] [2] [0] 
    const tensC = Math.floor(Math.abs(c) / 10)
    const onesC = Math.abs(c) % 10
    
    if (showSimplified) {
      // Simplified: [3] [x] [=] [2] [0]
      bars = [
        { key: 'coeff',    symbol: a === 1 ? '' : String(a), isLocked: true },
        { key: 'x',        symbol: 'x',            isLocked: true },
        { key: 'eq',       symbol: '=',            isLocked: true },
        { key: 'rhs-tens', symbol: tensC > 0 ? String(tensC) : ' ', isLocked: true },
        { key: 'rhs-ones', symbol: String(onesC),  isLocked: true },
      ]
    } else {
      bars = [
        { key: 'coeff',    symbol: a === 1 ? '' : String(a), isLocked: true },
        { key: 'x',        symbol: 'x',            isLocked: true },
        { key: 'sign',     symbol: sign,           isLocked: true, className: isVanishing ? 'cryptex-bar-vanishing' : '' },
        { key: 'const',    symbol: String(absB),   isLocked: false, className: isVanishing ? 'cryptex-bar-vanishing' : '' },
        { key: 'eq',       symbol: '=',            isLocked: true },
        { key: 'rhs-tens', symbol: tensC > 0 ? String(tensC) : ' ', isLocked: true },
        { key: 'rhs-ones', symbol: String(onesC),  isLocked: true },
      ]
    }
  }

  const [isApplied, setIsApplied] = useState(false)

  // Auto-apply when equation is solved
  useEffect(() => {
    if (isSolved && !isApplied) {
      playSuccessSound()
      const timer = setTimeout(() => {
        handleApply()
      }, 300) // Longer delay to enjoy the sparkle/sound
      return () => clearTimeout(timer)
    }
  }, [isSolved, isApplied])
  
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

  // The 4 operator pins that attach to the left side of the cryptex
  const pins = [
    { label: '×2', onClick: () => handleMultiply(2), colorClass: 'operator-pin--mul', tooltip: 'Multiply both sides by 2' },
    { label: '×3', onClick: () => handleMultiply(3), colorClass: 'operator-pin--mul', tooltip: 'Multiply both sides by 3' },
    { label: '÷2', onClick: () => handleDivide(2),   colorClass: 'operator-pin--div', tooltip: 'Divide both sides by 2' },
    { label: '÷3', onClick: () => handleDivide(3),   colorClass: 'operator-pin--div', tooltip: 'Divide both sides by 3' },
  ]

  return (
    <div className="cryptex-panel">

      <div className="cryptex-main-layout flex flex-col items-center justify-center gap-8">
        <div className={`cryptex-content-group ${isSolved ? 'cryptex-content-group--solved-sparkle' : ''}`}>

          {/* ── Drum bars ────────────────────── */}
          <div className="cryptex-frame-wrapper">
            {/* Sparkles on both sides */}
            <img src="/assets/sparkel_effect.png" alt="" className="cryptex-sparkle cryptex-sparkle--left" />
            <img src="/assets/sparkel_effect.png" alt="" className="cryptex-sparkle cryptex-sparkle--right" />

            <div className="cryptex-bars-container">
              {bars.map((bar) => (
                <CryptexBar
                  key={bar.key}
                  symbol={bar.symbol}
                  isLocked={bar.isLocked}
                  className={bar.className}
                  onScrollUp={bar.key === 'const' && !isApplied ? handleScrollUp : undefined}
                  onScrollDown={bar.key === 'const' && !isApplied ? handleScrollDown : undefined}
                />
              ))}
            </div>
          </div>

          {/* ── Vertical Connector (Mediator) ───────────────── */}
          <div className="cryptex-vertical-connector">
            <img src="/assets/vertical connector.png" alt="" />
          </div>

          {/* ── Operator Pins (Right of cryptex) ────────────────── */}
          <div className="cryptex-pin-rail">
            {/* <p className="pin-rail-label">Ops</p> */}
            {pins.map((pin) => (
              <OperatorPin
                key={pin.label}
                label={pin.label}
                onClick={pin.onClick}
                disabled={isApplied}
                colorClass={pin.colorClass}
                tooltip={pin.tooltip}
              />
            ))}
          </div>
        </div>

        {/* ── Undo Button (Now placed below cryptex within main group to prevent overlap) ─────────── */}
        {!isSolved && (
          <button
            type="button"
            className="cryptex-undo-btn disabled:opacity-40 disabled:grayscale disabled:pointer-events-none"
            onClick={engine.undo}
            disabled={engine.history.length === 0 || isApplied}
            title="Undo last operation"
          >
            ↩ Undo
          </button>
        )}

        {/* ── Apply Answer (Now hidden as we auto-apply) ────────────────────────────── */}
        {isSolved && false && (
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
