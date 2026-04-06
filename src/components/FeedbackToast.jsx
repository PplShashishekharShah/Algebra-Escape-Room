import React, { useEffect, useRef, useState } from 'react'

function NarrationSystem({ message, objective, gameCompleted, gameStarted, isMuted }) {
  const [displayMessage, setDisplayMessage] = useState("")
  const isSpeakingRef = useRef(false)
  const queueRef = useRef([])

  const lastObjectiveSpoken = useRef("")

  // Determine what to show and speak when props change
  useEffect(() => {
    if (!gameStarted) return

    const newSequence = []
    
    if (gameCompleted) {
      newSequence.push({ text: "Fantastic job! You've solved the equations and escaped the room. See you next time!", silent: false })
    } else {
      if (message) {
        newSequence.push({ text: message, silent: false })
        // If we have an immediate feedback message (like an error), always follow up with the objective hint
        if (objective) {
          // USER FIXED: donot read it by voice if it's a repeat due to wrong clicks
          newSequence.push({ text: objective, silent: true })
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
  }, [message, objective, gameCompleted, gameStarted])

  const processQueue = () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) return

    const { text, silent } = queueRef.current.shift()
    setDisplayMessage(text)
    
    // Check if muted globally or specific fragment is silent
    if (isMuted || silent || !window.speechSynthesis) {
      isSpeakingRef.current = true
      // Just display for a bit, then move to next
      setTimeout(() => {
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
        setTimeout(processQueue, 500)
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
