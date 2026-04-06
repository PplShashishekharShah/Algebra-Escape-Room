import React, { useEffect, useRef, useState } from 'react'

function NarrationSystem({ message, objective, gameCompleted, gameStarted, isMuted, solvedCount, toastKey }) {
  const [displayMessage, setDisplayMessage] = useState("")
  const isSpeakingRef = useRef(false)
  const queueRef = useRef([])

  const lastObjectiveSpoken = useRef("")
  const prevSolvedCount = useRef(0)
  const timeoutRef = useRef(null)

  // Determine what to show and speak when props change
  useEffect(() => {
    if (!gameStarted) return

    // Reset voice configuration when a clue is solved (clue find)
    if (solvedCount > prevSolvedCount.current) {
      lastObjectiveSpoken.current = ""
      prevSolvedCount.current = solvedCount
    }

    // DIRECT DISPLAY MODE: When muted, bypass the queue for instant visual feedback
    if (isMuted) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      isSpeakingRef.current = false
      
      if (message) {
        setDisplayMessage(message)
        // Show message for 3s, then revert to original hint (objective)
        timeoutRef.current = setTimeout(() => {
          setDisplayMessage(objective)
        }, 3000)
      } else {
        setDisplayMessage(objective)
      }
      return
    }

    // VOICED MODE: Use the queue system for natural-sounding TTS narration
    const newSequence = []
    
    if (gameCompleted) {
      newSequence.push({ text: "Fantastic job! You've solved the equations and escaped the room. See you next time!", silent: false })
    } else {
      if (message) {
        newSequence.push({ text: message, silent: false })
        // If we have an immediate feedback message (like an error), always follow up with the objective hint
        if (objective) {
          // USER FIXED: only silence it if it's a repeat; new objectives should be read
          const isRepeat = objective === lastObjectiveSpoken.current
          newSequence.push({ text: objective, silent: isRepeat })
          lastObjectiveSpoken.current = objective
        }
      } else if (objective && objective !== lastObjectiveSpoken.current) {
        // Only narrate objective on its own if it has changed (Normal flow)
        newSequence.push({ text: objective, silent: false })
        lastObjectiveSpoken.current = objective
      }
    }

    if (newSequence.length > 0) {
      // If there's a new message, we priority-replace the queue
      if (message) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        isSpeakingRef.current = false
        queueRef.current = newSequence
      } else {
        // Otherwise append only if not already in queue
        const currentTexts = queueRef.current.map(q => q.text)
        newSequence.forEach(item => {
          if (!currentTexts.includes(item.text)) {
            queueRef.current.push(item)
          }
        })
      }
      processQueue()
    }
  }, [message, objective, gameCompleted, gameStarted, isMuted, toastKey])

  const processQueue = () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) return

    const { text, silent } = queueRef.current.shift()
    setDisplayMessage(text)
    
    // Check if muted globally or specific fragment is silent
    if (isMuted || silent || !window.speechSynthesis) {
      isSpeakingRef.current = true
      // Just display for a bit, then move to next
      timeoutRef.current = setTimeout(() => {
        isSpeakingRef.current = false
        processQueue()
      }, 3000)
      return
    }

    isSpeakingRef.current = true
    window.speechSynthesis.cancel() 
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.1
    
    utterance.onend = () => {
      isSpeakingRef.current = false
      if (queueRef.current.length > 0) {
        timeoutRef.current = setTimeout(processQueue, 500)
      }
    }

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="feedback-rat-container">
      <img
        src="/assets/Rat_character.png"
        alt="Detective Rat"
        className="rat-character"
      />
      <div className="speech-bubble-container">
        <p className="max-w-[75%] mx-auto leading-tight text-lg font-bold">
          {displayMessage || "..." }
        </p>
      </div>
    </div>
  )
}

export default NarrationSystem
