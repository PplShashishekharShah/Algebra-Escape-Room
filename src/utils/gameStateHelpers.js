export function getCurrentTargetObject(level, solvedObjects) {
  const nextTargetId = level.objectsOrder.find((objectId) => !solvedObjects[objectId])
  return level.objects.find((object) => object.id === nextTargetId) ?? null
}

export function isCorrectObjectClick(objectId, currentTargetObject) {
  return currentTargetObject?.id === objectId
}

export function openPuzzleForObject(objectId, level) {
  return level.objects.find((object) => object.id === objectId) ?? null
}

export function awardDigitToSlot(level, objectId, collectedDigits) {
  const objectIndex = level.objectsOrder.findIndex((id) => id === objectId)
  if (objectIndex === -1) {
    return collectedDigits
  }

  const object = level.objects.find((item) => item.id === objectId)
  const nextDigits = [...collectedDigits]
  nextDigits[objectIndex] = object?.digitReward ?? null
  return nextDigits
}

export function checkAllPuzzlesSolved(solvedObjects) {
  return Object.values(solvedObjects).every(Boolean)
}

export function attemptDoorUnlock(codeInput, doorCode) {
  if (codeInput.length !== doorCode.length) {
    return false
  }

  return codeInput.every((digit, index) => Number(digit) === doorCode[index])
}
