export function getCurrentHint(puzzle, hintLevel) {
  if (!puzzle || hintLevel <= 0) {
    return null
  }

  return puzzle.hints.find((hint) => hint.level === hintLevel) ?? null
}

export function unlockNextHint({ currentLevel, currentHint, miniSolved }) {
  if (!currentHint) {
    return 1
  }

  if (currentHint.type === 'miniQuestion' && !miniSolved) {
    return currentLevel
  }

  return Math.min(currentLevel + 1, 3)
}
