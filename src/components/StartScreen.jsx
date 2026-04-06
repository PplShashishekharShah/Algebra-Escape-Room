import React from 'react'

function StartScreen({ onStart }) {
  return (
    <div className="start-screen-overlay">
      <div className="start-screen-content border-2 border-white rounded-2xl px-8 py-10 shadow-soft bg-white/5">
        <img 
          src="/assets/Key (Reward Asset).png" 
          alt="Game Icon" 
          className="game-logo mx-auto animate-bounce"
        />
        
        <p className=" font-display text-5xl text-white mb-4 tracking-tight">
          ALGEBRA ESCAPE ROOM
        </p>
        
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
        Powered by Playpower Labs
      </div>
    </div>
  )
}

export default StartScreen
