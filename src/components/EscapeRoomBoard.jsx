import React, { useEffect } from 'react'
import RoomObject from './RoomObject'

const objectScale = {
  book: { width: 164, height: 100 },
  box: { width: 186, height: 124 },
  envelope: { width: 136, height: 90 },
}

function EscapeRoomBoard({ level, game }) {
  // Trigger vibration/sound on victory
  useEffect(() => {
    if (game.gameCompleted) {
      // Haptic Feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200])
      }

      // Synthesized Victory Sound
      const playVictorySound = () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext
          if (!AudioContext) return
          
          const ctx = new AudioContext()
          const playTone = (freq, time, duration) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.value = freq
            gain.gain.setValueAtTime(0, time)
            gain.gain.linearRampToValueAtTime(0.2, time + 0.05)
            gain.gain.exponentialRampToValueAtTime(0.01, time + duration)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(time)
            osc.stop(time + duration)
          }

          const now = ctx.currentTime
          playTone(523.25, now, 0.5) // C5
          playTone(659.25, now + 0.15, 0.5) // E5
          playTone(783.99, now + 0.3, 0.8) // G5
          playTone(1046.50, now + 0.45, 1.2) // C6
        } catch (e) {
          console.warn("Audio context failed", e)
        }
      }
      playVictorySound()
    }
  }, [game.gameCompleted])

  return (
    <section className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-slate-950">
      <div className="relative h-full w-full">
        {/* Wall Frame Decorator */}
        <img
          src="/assets/image frame.png"
          alt=""
          className="absolute left-[8%] top-[3%] z-10 w-[120px] object-contain opacity-90 drop-shadow-2xl"
        />

        {/* Dynamic Background (Door opens on victory) */}
        <img
          src={game.gameCompleted ? "/assets/Escape Room Open.png" : "/assets/Background Escape Room_2.png"}
          alt="Escape room background"
          className="h-full w-full object-cover transition-all duration-1000"
        />

        <div className="absolute inset-0">
          {!game.gameCompleted && level.objects.map((objectData) => {
            const size = objectScale[objectData.id]

            return (
              <RoomObject
                key={objectData.id}
                objectData={objectData}
                isTarget={game.currentTargetObject?.id === objectData.id}
                isSolved={game.solvedObjects[objectData.id]}
                onClick={game.handleObjectClick}
                celebration={game.celebrationObjectId === objectData.id}
                width={size.width}
                height={size.height}
              />
            )
          })}

          {!game.gameCompleted && (
            <button
              type="button"
              onClick={game.openDoorPanel}
              className={`door-lock-button ${
                game.doorUnlocked
                  ? 'unlocked'
                  : game.collectedDigits.every((digit) => digit !== null)
                    ? 'ready'
                    : ''
              }`}
              aria-label="Door lock"
            />
          )}
        </div>

        {/* Victory Reset Button (Corner instead of Popup) */}
        {game.gameCompleted && (
          <div className="absolute bottom-10 right-10 z-[250] animate-fadeIn">
            <button
              type="button"
              onClick={game.resetGame}
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-goldplay text-inkplay shadow-xl ring-4 ring-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 17-5-5 5-5"/><path d="M2 17v-6a4 4 0 0 1 4-4h10"/><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/>
                </svg>
              </div>
              <span className="font-display text-sm tracking-widest text-[#1a2a3a] uppercase bg-white/80 px-3 py-1 rounded-lg">Play Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default EscapeRoomBoard
