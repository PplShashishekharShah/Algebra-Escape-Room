import React, { useEffect, useRef, useState } from 'react'

function SpeechBubble({ message, objective, gameCompleted, gameStarted, isMuted, solvedCount, toastKey }) {
  const [displayMessage, setDisplayMessage] = useState("")
  const isSpeakingRef = useRef(false)
  const queueRef = useRef([])

  const lastObjectiveSpoken = useRef("")
  const prevSolvedCount = useRef(0)
  const timeoutRef = useRef(null)
  const introPlayedRef = useRef(false)

  // Determine what to show and speak when props change
  useEffect(() => {
    if (!gameStarted) {
      introPlayedRef.current = false
      return
    }

    // VOICED MODE: Use the queue system for natural-sounding TTS narration
    const newSequence = []

    // ── Intro Sequence ───────────────────────
    // Only trigger this once at the exact start of the game
    if (gameStarted && !introPlayedRef.current) {
        introPlayedRef.current = true
        
        // 1. Welcome Message
        newSequence.push({ 
            text: "Welcome to the Algebra Escape Room! I'm your detective partner.", 
            silent: false 
        })
        
        // 2. Rules Message
        newSequence.push({ 
            text: "To escape, you need to find 3 hidden clues. Each clue has an algebra puzzle to solve.", 
            silent: false 
        })

        // 3. Goal/Mission Message
        newSequence.push({ 
            text: "Let's start!", 
            silent: false 
        })
        
        // 4. Follow up with the initial clue (the objective)
        if (objective) {
            newSequence.push({ text: objective, silent: false })
            lastObjectiveSpoken.current = objective
        }
        
        queueRef.current = newSequence
        processQueue()
        return
    }

    // Reset voice configuration when a clue is solved
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
        timeoutRef.current = setTimeout(() => {
          setDisplayMessage(objective)
        }, 3000)
      } else {
        setDisplayMessage(objective)
      }
      return
    }
    
    if (gameCompleted) {
      newSequence.push({ text: "Fantastic job! You've solved the equations and escaped the room. See you next time!", silent: false })
    } else {
      if (message) {
        newSequence.push({ text: message, silent: false })
        if (objective) {
          const isRepeat = objective === lastObjectiveSpoken.current
          newSequence.push({ text: objective, silent: isRepeat })
          lastObjectiveSpoken.current = objective
        }
      } else if (objective && objective !== lastObjectiveSpoken.current) {
        newSequence.push({ text: objective, silent: false })
        lastObjectiveSpoken.current = objective
      }
    }

    if (newSequence.length > 0) {
      if (message) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        isSpeakingRef.current = false
        queueRef.current = newSequence
      } else {
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
    
    if (isMuted || silent || !window.speechSynthesis) {
      isSpeakingRef.current = true
      timeoutRef.current = setTimeout(() => {
        isSpeakingRef.current = false
        processQueue()
      }, 3500) // Slightly longer for easier reading
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

export default SpeechBubble
