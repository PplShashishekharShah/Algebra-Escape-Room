import React, { useState, useEffect } from 'react'
import GameLayout from './components/GameLayout'
import StartScreen from './components/StartScreen'
import level1 from './data/level1.json'
import level2 from './data/level2.json'
import { useEscapeRoomGame } from './hooks/useEscapeRoomGame'

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let rafId
    const handleMouseMove = (e) => {
      rafId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform'
      }}
      aria-hidden="true"
    >
      <img
        src="/assets/hand_emoji.png"
        alt=""
        style={{ width: '40px', height: '40px', objectFit: 'contain', transform: 'translate(-5px, -5px)' }}
      />
    </div>
  )
}

const ALL_ASSETS = [
  '/assets/green_btn.png',
  '/assets/red_btn.png',
  '/assets/yellow_btn.png',
  '/assets/Puzzle Popup Panel.png',
  '/assets/Input Box.png',
  '/assets/Submit Button.png',
  '/assets/cryptex_frame1.png',
  '/assets/vertical_bar.png',
  '/assets/vertical_bar_static.png',
  '/assets/green_up.png',
  '/assets/red_down.png',
  '/assets/hand_emoji.png',
  '/assets/speech_bubble.png',
  '/assets/Background Escape Room_2.png',
  '/assets/box.png',
  '/assets/book.png',
  '/assets/envelope.png',
  '/assets/frame.png',
  '/assets/cactus.png',
  '/assets/carpet.png',
  '/assets/glow.png',
  '/assets/rat.png',
]

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [currentLevelData, setCurrentLevelData] = useState(level1)
  const game = useEscapeRoomGame(currentLevelData)

  useEffect(() => {
    let loadedCount = 0
    const totalAssets = ALL_ASSETS.length

    const preload = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => {
          loadedCount++
          setLoadProgress(Math.round((loadedCount / totalAssets) * 100))
          resolve()
        }
        img.onerror = resolve // Continue even if one fails
      })
    }

    Promise.all(ALL_ASSETS.map(preload)).then(() => {
      setTimeout(() => setAssetsLoaded(true), 500) // Small delay for smooth transition
    })
  }, [])

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleNextLevel = () => {
    setCurrentLevelData(level2)
    game.resetGame()
  }

  if (!assetsLoaded) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center z-[9999]">
        <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="mt-4 text-yellow-500 font-display text-xl animate-pulse tracking-widest">
          LOADING ADVENTURE... {loadProgress}%
        </p>
      </div>
    )
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
