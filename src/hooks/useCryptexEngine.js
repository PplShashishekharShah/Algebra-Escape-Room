import { useState } from 'react'

export function useCryptexEngine(initialEquation) {
  const [equation, setEquation] = useState(initialEquation)
  const [history, setHistory] = useState([])

  // Solved when a===1 and b===0  →  x = c
  const isSolved = equation.a === 1 && equation.b === 0

  /** Add delta to both b and c (constant-term operation). */
  function applyAdd(delta) {
    setHistory((prev) => [...prev, equation])
    setEquation((prev) => ({
      ...prev,
      b: prev.b + delta,
      c: prev.c + delta,
    }))
  }

  /** Multiply every term by factor. */
  function applyMultiply(factor) {
    setHistory((prev) => [...prev, equation])
    setEquation((prev) => ({
      a: prev.a * factor,
      b: prev.b * factor,
      c: prev.c * factor,
    }))
  }

  /**
   * Divide every term by factor.
   * Returns { error: string } if not evenly divisible, null on success.
   */
  function applyDivide(factor) {
    const { a, b, c } = equation
    const issues = []
    if (a % factor !== 0) issues.push(`coefficient (${a})`)
    if (b !== 0 && b % factor !== 0) issues.push(`constant (${Math.abs(b)})`)
    if (c % factor !== 0) issues.push(`right side (${c})`)

    if (issues.length > 0) {
      const constantHint = b !== 0 && b % factor !== 0
        ? ' Zero out the constant first!'
        : ''
      return {
        error: `Can't ÷${factor} — ${issues.join(' and ')} ${issues.length > 1 ? 'are' : 'is'} not divisible.${constantHint}`,
      }
    }

    setHistory((prev) => [...prev, equation])
    setEquation((prev) => ({
      a: prev.a / factor,
      b: prev.b / factor,
      c: prev.c / factor,
    }))
    return null
  }

  /** Undo the last operation. */
  function undo() {
    if (history.length === 0) return
    setEquation(history[history.length - 1])
    setHistory((prev) => prev.slice(0, -1))
  }

  /** Reset to initial equation. */
  function reset() {
    setEquation(initialEquation)
    setHistory([])
  }

  return {
    equation,
    history,
    isSolved,
    applyAdd,
    applyMultiply,
    applyDivide,
    undo,
    reset,
  }
}
