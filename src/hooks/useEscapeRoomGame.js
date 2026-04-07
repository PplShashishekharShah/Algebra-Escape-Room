import { useEffect, useMemo, useState } from 'react'
import { getCurrentHint, unlockNextHint } from '../utils/hintHelpers'
import {
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
  const [gameCompleted, setGameCompleted] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const [wrongPulse, setWrongPulse] = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [celebrationObjectId, setCelebrationObjectId] = useState(null)
  const [isMuted, setIsMuted] = useState(false)

  // Reset game state when the level changes
  useEffect(() => {
    resetGame()
  }, [level.id])

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

  const allPuzzlesSolved = useMemo(
    () => checkAllPuzzlesSolved(solvedObjects),
    [solvedObjects],
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
    audio.play().catch(() => {})
  }

  function flashFeedback(message, type = 'info') {
    setToastKey((previous) => previous + 1)
    setFeedback({ message, type, visible: true })
  }

  function toggleMute() {
    setIsMuted(prev => !prev)
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }

  function triggerWrongPulse() {
    setWrongPulse(true)
    setWrongFlash(true)
    if ('vibrate' in navigator) navigator.vibrate(200)

    window.clearTimeout(triggerWrongPulse.pulseTimeoutId)
    triggerWrongPulse.pulseTimeoutId = window.setTimeout(() => {
      setWrongPulse(false)
    }, 450)

    window.clearTimeout(triggerWrongPulse.flashTimeoutId)
    triggerWrongPulse.flashTimeoutId = window.setTimeout(() => {
      setWrongFlash(false)
    }, 1000)
  }

  function openTargetPuzzle(objectId) {
    setActivePuzzleId(objectId)
    setShowPuzzleModal(true)
    setHintProgress({ puzzleId: objectId, level: 0, miniSolved: false })
    setPuzzleAnswer('')
    setMiniHintAnswer('')
  }

  function handleObjectClick(objectId) {
    if (gameCompleted) return

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
    setHintProgress({ puzzleId: null, level: 0, miniSolved: false })
    setPuzzleAnswer('')
    setMiniHintAnswer('')
  }

  function revealHints() {
    if (hintProgress.level === 0) {
      playSound('hint')
      setHintProgress((previous) => ({ ...previous, level: 1 }))
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
    if (!currentHint || currentHint.type !== 'miniQuestion') return

    if (checkMiniHintAnswer(currentHint, miniHintAnswer)) {
      playSound('success')
      setHintProgress((previous) => ({
        ...previous,
        miniSolved: true,
        level: 3, // Auto-advance to level 3
      }))
      flashFeedback(currentHint.successMessage, 'success')
      return
    }

    playSound('error')
    flashFeedback('Not quite. Try once more!', 'error')
    triggerWrongPulse()
  }

  function submitPuzzleAnswer() {
    if (!activePuzzleObject) return

    if (!checkMainAnswer(activePuzzleObject.puzzle, puzzleAnswer)) {
      playSound('error')
      flashFeedback("Try again — you're close!", 'error')
      triggerWrongPulse()
      return
    }

    const objectId = activePuzzleObject.id
    const nextSolvedObjects = { ...solvedObjects, [objectId]: true }

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
      flashFeedback('All 3 keys found! Open the door!', 'success')
    } else {
      flashFeedback('Key digit found!', 'success')
    }

    closePuzzleModal()
  }

  function openDoor() {
    if (!allPuzzlesSolved) {
      flashFeedback('Solve all 3 clues first!', 'info')
      return
    }
    setDoorUnlocked(true)
    setGameCompleted(true)
    playSound('unlocked')
    flashFeedback('You escaped the room!', 'success')
  }

  function resetGame() {
    setSolvedObjects(buildInitialSolvedState(level))
    setCollectedDigits([null, null, null])
    setActivePuzzleId(null)
    setShowPuzzleModal(false)
    setHintProgress({ puzzleId: null, level: 0, miniSolved: false })
    setFeedback(defaultFeedback)
    setPuzzleAnswer('')
    setMiniHintAnswer('')
    setDoorUnlocked(false)
    setGameCompleted(false)
    setWrongPulse(false)
    setWrongFlash(false)
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
    doorUnlocked,
    allPuzzlesSolved,
    feedback,
    toastKey,
    wrongPulse,
    wrongFlash,
    gameCompleted,
    celebrationObjectId,
    isMuted,
    solvedCount: Object.values(solvedObjects).filter(Boolean).length,
    toggleMute,
    handleObjectClick,
    closePuzzleModal,
    revealHints,
    goToNextHint,
    submitMiniHintAnswer,
    submitPuzzleAnswer,
    openDoor,
    resetGame,
  }
}
