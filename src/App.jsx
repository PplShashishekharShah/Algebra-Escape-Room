import React from 'react'
import GameLayout from './components/GameLayout'
import level1 from './data/level1.json'
import { useEscapeRoomGame } from './hooks/useEscapeRoomGame'

function App() {
  const game = useEscapeRoomGame(level1)

  return <GameLayout level={level1} game={game} />
}

export default App
