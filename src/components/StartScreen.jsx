import React from 'react'

function StartScreen({ onStart }) {
  return (
    <div className="start-screen-overlay">
      <div className="start-screen-content">
        <img 
          src="/assets/Key (Reward Asset).png" 
          alt="Game Icon" 
          className="game-logo mx-auto animate-bounce"
        />
        
        <h1 className=" font-display text-5xl text-white mb-4 tracking-tight">
          ALGEBRA ESCAPE ROOM
        </h1>
        
        <p className="text-xl text-white/80 mb-12 font-medium">
          Crack the clues. Collect the digits. Escape.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            type="button" 
            className="how-to-play-button"
            onClick={() => alert("How to Play: Find clues in the room, solve the algebra puzzles to get digits, and enter the code to unlock the door!")}
          >
            How to Play
          </button>
          
          <button 
            type="button" 
            className="start-button"
            onClick={onStart}
          >
            Start Game
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-white/30 text-xs uppercase tracking-widest">
        Powered by Advanced Algebra
      </div>
    </div>
  )
}

export default StartScreen
