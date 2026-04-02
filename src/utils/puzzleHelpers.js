export function normalizeNumericInput(value) {
  const normalized = `${value}`.trim()
  if (normalized === '') {
    return null
  }

  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

export function checkMainAnswer(puzzle, userAnswer) {
  return normalizeNumericInput(userAnswer) === puzzle.answer
}

export function checkMiniHintAnswer(hint, userAnswer) {
  return normalizeNumericInput(userAnswer) === hint.answer
}
