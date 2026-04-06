import React, { useState, useEffect } from 'react'
import GameLayout from './components/GameLayout'
import StartScreen from './components/StartScreen'
import level1 from './data/level1.json'
import level2 from './data/level2.json'
import { useEscapeRoomGame } from './hooks/useEscapeRoomGame'

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: 'translate(-5px, -5px)', // Adjust hotspot
      }}
    >
      <img
        src="/assets/hand_emoji.png"
        alt=""
        style={{ width: '52px', height: '52px', objectFit: 'contain' }}
      />
    </div>
  )
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevelData, setCurrentLevelData] = useState(level1)
  const game = useEscapeRoomGame(currentLevelData)

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleNextLevel = () => {
    setCurrentLevelData(level2)
    game.resetGame()
  }

  return (
    <>
      <CustomCursor />
      <GameLayout
        level={currentLevelData}
        game={game}
        gameStarted={gameStarted}
        onNextLevel={handleNextLevel}
        isLevel2={currentLevelData.id === 'level-2'}
      />
      {!gameStarted && <StartScreen onStart={handleStart} />}
    </>
  )
}

export default App
