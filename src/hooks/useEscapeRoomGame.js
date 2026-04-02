import { useMemo, useState } from 'react'
import { getCurrentHint, unlockNextHint } from '../utils/hintHelpers'
import {
  attemptDoorUnlock,
  awardDigitToSlot,
  checkAllPuzzlesSolved,
  getCurrentTargetObject,
  isCorrectObjectClick,
  openPuzzleForObject,
} from '../utils/gameStateHelpers'
import { checkMainAnswer, checkMiniHintAnswer } from '../utils/puzzleHelpers'

const defaultFeedback = {
  message: '',
  type: 'info',
  visible: false,
}

const emptyDoorInput = ['', '', '']

function buildInitialSolvedState(level) {
  return level.objectsOrder.reduce((accumulator, objectId) => {
    accumulator[objectId] = false
    return accumulator
  }, {})
}

export function useEscapeRoomGame(level) {
  const [solvedObjects, setSolvedObjects] = useState(() => buildInitialSolvedState(level))
  const [collectedDigits, setCollectedDigits] = useState([null, null, null])
  const [activePuzzleId, setActivePuzzleId] = useState(null)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)
  const [hintProgress, setHintProgress] = useState({
    puzzleId: null,
    level: 0,
    miniSolved: false,
  })
  const [feedback, setFeedback] = useState(defaultFeedback)
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [miniHintAnswer, setMiniHintAnswer] = useState('')
  const [doorUnlocked, setDoorUnlocked] = useState(false)
  const [showDoorPanel, setShowDoorPanel] = useState(false)
  const [doorCodeInput, setDoorCodeInput] = useState(emptyDoorInput)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const [wrongPulse, setWrongPulse] = useState(false)
  const [celebrationObjectId, setCelebrationObjectId] = useState(null)

  const currentTargetObject = useMemo(
    () => getCurrentTargetObject(level, solvedObjects),
    [level, solvedObjects],
  )

  const activePuzzleObject = useMemo(
    () => (activePuzzleId ? openPuzzleForObject(activePuzzleId, level) : null),
    [activePuzzleId, level],
  )

  const currentHint = useMemo(
    () => getCurrentHint(activePuzzleObject?.puzzle, hintProgress.level),
    [activePuzzleObject, hintProgress.level],
  )

  const playSound = (soundType) => {
    const soundUrls = {
      click: '/assets/sounds/click.mp3',
      success: '/assets/sounds/success.mp3',
      error: '/assets/sounds/error.mp3',
      unlocked: '/assets/sounds/unlocked.mp3',
      hint: '/assets/sounds/hint.mp3',
    }

    const audio = new Audio(soundUrls[soundType])
    audio.play().catch(() => {
      // Ignore errors if sound can't be played (common for browsers)
    })
  }

  function flashFeedback(message, type = 'info') {
    setToastKey((previous) => previous + 1)
    setFeedback({
      message,
      type,
      visible: true,
    })
  }

  function triggerWrongPulse() {
    setWrongPulse(true)
    window.clearTimeout(triggerWrongPulse.timeoutId)
    triggerWrongPulse.timeoutId = window.setTimeout(() => {
      setWrongPulse(false)
    }, 450)
  }

  function openTargetPuzzle(objectId) {
    setActivePuzzleId(objectId)
    setShowPuzzleModal(true)
    setHintProgress({
      puzzleId: objectId,
      level: 0,
      miniSolved: false,
    })
    setPuzzleAnswer('')
    setMiniHintAnswer('')
  }

  function handleObjectClick(objectId) {
    if (gameCompleted) {
      return
    }

    if (!isCorrectObjectClick(objectId, currentTargetObject)) {
      flashFeedback('That is not the right clue yet.', 'error')
      triggerWrongPulse()
      return
    }

    playSound('click')
    openTargetPuzzle(objectId)
  }

  function closePuzzleModal() {
    setShowPuzzleModal(false)
    setActivePuzzleId(null)
    setHintProgress({
      puzzleId: null,
      level: 0,
      miniSolved: false,
    })
    setPuzzleAnswer('')
    setMiniHintAnswer('')
  }

  function revealHints() {
    if (hintProgress.level === 0) {
      playSound('hint')
      setHintProgress((previous) => ({
        ...previous,
        level: 1,
      }))
    }
  }

  function goToNextHint() {
    playSound('click')
    setHintProgress((previous) => ({
      ...previous,
      level: unlockNextHint({
        currentLevel: previous.level,
        currentHint,
        miniSolved: previous.miniSolved,
      }),
    }))
  }

  function submitMiniHintAnswer() {
    if (!currentHint || currentHint.type !== 'miniQuestion') {
      return
    }

    if (checkMiniHintAnswer(currentHint, miniHintAnswer)) {
      playSound('success')
      setHintProgress((previous) => ({
        ...previous,
        miniSolved: true,
      }))
      flashFeedback(currentHint.successMessage, 'success')
      return
    }

    playSound('error')
    flashFeedback("Almost there. Try the mini-question one more time.", 'error')
    triggerWrongPulse()
  }

  function submitPuzzleAnswer() {
    if (!activePuzzleObject) {
      return
    }

    if (!checkMainAnswer(activePuzzleObject.puzzle, puzzleAnswer)) {
      playSound('error')
      flashFeedback("Try again - you're close!", 'error')
      triggerWrongPulse()
      return
    }

    const objectId = activePuzzleObject.id
    const nextSolvedObjects = {
      ...solvedObjects,
      [objectId]: true,
    }

    setSolvedObjects(nextSolvedObjects)
    setCollectedDigits((previousDigits) => awardDigitToSlot(level, objectId, previousDigits))
    setCelebrationObjectId(objectId)
    playSound('success')
    window.clearTimeout(submitPuzzleAnswer.celebrationTimeoutId)
    submitPuzzleAnswer.celebrationTimeoutId = window.setTimeout(() => {
      setCelebrationObjectId(null)
    }, 1200)

    const finishedAll = checkAllPuzzlesSolved(nextSolvedObjects)

    if (finishedAll) {
      flashFeedback('Awesome! You found all 3 key digits. Unlock the door!', 'success')
    } else {
      flashFeedback('Awesome! You found a key digit.', 'success')
    }

    closePuzzleModal()
  }

  function openDoorPanel() {
    if (!checkAllPuzzlesSolved(solvedObjects)) {
      flashFeedback('Solve all 3 clues before unlocking the door.', 'info')
      return
    }

    setShowDoorPanel(true)
  }

  function closeDoorPanel() {
    setShowDoorPanel(false)
    setDoorCodeInput(emptyDoorInput)
  }

  function setDoorDigit(index, value) {
    const nextDigits = [...doorCodeInput]
    nextDigits[index] = `${value}`.slice(-1)
    setDoorCodeInput(nextDigits)
  }

  function handleDoorPadInput(value) {
    const nextIndex = doorCodeInput.findIndex((digit) => digit === '')
    if (nextIndex === -1) {
      return
    }

    setDoorDigit(nextIndex, value)
  }

  function clearDoorInput() {
    setDoorCodeInput(emptyDoorInput)
  }

  function verifyDoorCode() {
    if (!attemptDoorUnlock(doorCodeInput, level.doorCode)) {
      playSound('error')
      flashFeedback("That code didn't work yet. Check your key digits.", 'error')
      triggerWrongPulse()
      return
    }

    setDoorUnlocked(true)
    setGameCompleted(true)
    setShowDoorPanel(false)
    playSound('unlocked')
    flashFeedback('You escaped the room!', 'success')
  }

  function resetGame() {
    setSolvedObjects(buildInitialSolvedState(level))
    setCollectedDigits([null, null, null])
    setActivePuzzleId(null)
    setShowPuzzleModal(false)
    setHintProgress({
      puzzleId: null,
      level: 0,
      miniSolved: false,
    })
    setFeedback(defaultFeedback)
    setPuzzleAnswer('')
    setMiniHintAnswer('')
    setDoorUnlocked(false)
    setShowDoorPanel(false)
    setDoorCodeInput(emptyDoorInput)
    setGameCompleted(false)
    setWrongPulse(false)
    setCelebrationObjectId(null)
  }

  return {
    currentTargetObject,
    solvedObjects,
    collectedDigits,
    activePuzzleObject,
    showPuzzleModal,
    hintProgress,
    currentHint,
    puzzleAnswer,
    setPuzzleAnswer,
    miniHintAnswer,
    setMiniHintAnswer,
    showDoorPanel,
    doorUnlocked,
    doorCodeInput,
    feedback,
    toastKey,
    wrongPulse,
    gameCompleted,
    celebrationObjectId,
    handleObjectClick,
    closePuzzleModal,
    revealHints,
    goToNextHint,
    submitMiniHintAnswer,
    submitPuzzleAnswer,
    openDoorPanel,
    closeDoorPanel,
    setDoorDigit,
    handleDoorPadInput,
    clearDoorInput,
    verifyDoorCode,
    resetGame,
  }
}
