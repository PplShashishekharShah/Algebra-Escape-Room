import React, { useEffect, useMemo } from 'react'

function NarrationSystem({ message, objective, gameCompleted }) {
  const currentNarration = useMemo(() => {
    // If the game is won, use a victory message
    if (gameCompleted) {
      return "Fantastic job! You've solved the equations and escaped the room. See you next time!"
    }
    
    // Priority 1: Direct feedback (if provided and visible)
    if (message) {
      return message
    }
    
    // Initial welcome or objective narration
    const baseNarration = "Welcome to the Algebra Escape Room! "
    return `${baseNarration}${objective}`
  }, [message, objective, gameCompleted])

  useEffect(() => {
    if (currentNarration) {
      window.speechSynthesis.cancel() // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(currentNarration)
      utterance.rate = 1.0
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }, [currentNarration])

  return (
    <div className="feedback-rat-container">
      <img
        src="/assets/Rat_character.png"
        alt="Detective Rat"
        className="rat-character"
      />
      <div className="speech-bubble-container">
        <p className="max-w-[80%] mx-auto leading-tight">{currentNarration}</p>
      </div>
    </div>
  )
}

export default NarrationSystem
