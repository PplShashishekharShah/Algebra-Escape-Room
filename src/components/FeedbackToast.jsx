import React, { useEffect, useRef, useState } from 'react'

function NarrationSystem({ message, objective, gameCompleted, gameStarted }) {
  const [displayMessage, setDisplayMessage] = useState("")
  const isSpeakingRef = useRef(false)
  const queueRef = useRef([])

  const lastObjectiveSpoken = useRef("")

  // Determine what to show and speak when props change
  useEffect(() => {
    if (!gameStarted) return

    const newSequence = []
    
    if (gameCompleted) {
      newSequence.push("Fantastic job! You've solved the equations and escaped the room. See you next time!")
    } else {
      if (message) {
        newSequence.push(message)
        // If we have an immediate feedback message, always follow up with current objective
        if (objective && objective !== lastObjectiveSpoken.current) {
          newSequence.push(objective)
          lastObjectiveSpoken.current = objective
        }
      } else if (objective && objective !== lastObjectiveSpoken.current) {
        // Only narrate objective on its own if it has changed
        newSequence.push(objective)
        lastObjectiveSpoken.current = objective
      }
    }

    if (newSequence.length > 0) {
      // If there's a new message, we priority-replace the queue
      if (message) {
        queueRef.current = newSequence
      } else {
        // Otherwise append only if not already in queue
        queueRef.current = Array.from(new Set([...queueRef.current, ...newSequence]))
      }
      processQueue()
    }
  }, [message, objective, gameCompleted, gameStarted])

  const processQueue = () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) return

    const nextText = queueRef.current.shift()
    setDisplayMessage(nextText)
    isSpeakingRef.current = true

    window.speechSynthesis.cancel() 
    const utterance = new SpeechSynthesisUtterance(nextText)
    utterance.rate = 1.0
    utterance.pitch = 1.1
    
    utterance.onend = () => {
      isSpeakingRef.current = false
      // If there's more in queue, process it after a small pause
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
