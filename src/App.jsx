import React, { useState } from 'react'
import GameLayout from './components/GameLayout'
import StartScreen from './components/StartScreen'
import level1 from './data/level1.json'
import { useEscapeRoomGame } from './hooks/useEscapeRoomGame'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const game = useEscapeRoomGame(level1)

  return (
    <>
      <GameLayout level={level1} game={game} />
      {!gameStarted && <StartScreen onStart={() => setGameStarted(true)} />}
    </>
  )
}

export default App
