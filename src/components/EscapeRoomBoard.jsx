import React, { useEffect } from 'react'
import RoomObject from './RoomObject'

// All assets that always appear in the room, regardless of level.
// CSS classes (e.g. .clue-book) override exact positions.
const ALL_ROOM_ASSETS = [
  { id: 'book',     asset: 'Book (Knowledge Object).png',    width: 164, height: 100 },
  { id: 'box',      asset: 'Box (Storage Object).png',       width: 186, height: 124 },
  { id: 'envelope', asset: 'Envelope (Message Object).png',  width: 136, height:  90 },
  { id: 'frame',    asset: 'image frame.png',                width: 120, height: 100 },
  { id: 'cactus',   asset: 'cactus.png',                     width: 220, height: 280 },
  { id: 'carpet',   asset: 'carpet_on_floor.png',            width: 300, height:  100 },
]

function EscapeRoomBoard({ level, game, onNextLevel, isLevel2 }) {
  // Trigger vibration/sound on victory
  useEffect(() => {
    if (game.gameCompleted) {
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200])

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
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
          playTone(523.25, now, 0.5)
          playTone(659.25, now + 0.15, 0.5)
          playTone(783.99, now + 0.3, 0.8)
          playTone(1046.50, now + 0.45, 1.2)
        }
      } catch (e) { console.warn('Audio context failed', e) }
    }
  }, [game.gameCompleted])

  // Build a quick lookup: which assets are active clues this level
  const activeClueMap = {}
  level.objects.forEach(obj => { activeClueMap[obj.id] = obj })

  return (
    <section className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-slate-950">
      <div className="relative h-full w-full">

        {/* Background (switches on victory) */}
        <img
          src={game.gameCompleted ? '/assets/Escape Room Open.png' : '/assets/Background Escape Room_2_clean.png'}
          alt="Escape room background"
          className="h-full w-full object-cover transition-all duration-1000"
        />

        <div className="absolute inset-0">
          {/* Door code digit reflection */}
          {!game.gameCompleted && (
            <div className="door-integrated-slots">
              {game.doorCodeInput.map((digit, i) => (
                <div key={i} className="door-digit">{digit || ''}</div>
              ))}
            </div>
          )}

          {/* Always render ALL 6 assets. Active clues are buttons; others are decorative imgs */}
          {!game.gameCompleted && ALL_ROOM_ASSETS.map((asset) => {
            const clueData = activeClueMap[asset.id]

            if (clueData) {
              // This asset is an interactive clue for this level
              return (
                <RoomObject
                  key={asset.id}
                  objectData={clueData}
                  isTarget={game.currentTargetObject?.id === asset.id}
                  isSolved={game.solvedObjects[asset.id]}
                  onClick={game.handleObjectClick}
                  celebration={game.celebrationObjectId === asset.id}
                  width={asset.width}
                  height={asset.height}
                />
              )
            }

            // This asset is just a decorative prop — render at its CSS-defined position
            return (
              <img
                key={asset.id}
                src={`/assets/${asset.asset}`}
                alt=""
                className={`room-object-btn clue-${asset.id}`}
                onClick={() => game.handleObjectClick(asset.id)}
                style={{ width: asset.width, height: asset.height }}
              />
            )
          })}

          {/* Door lock hit area */}
          {!game.gameCompleted && (
            <button
              type="button"
              onClick={game.openDoorPanel}
              className={`door-lock-button ${
                game.doorUnlocked
                  ? 'unlocked'
                  : game.collectedDigits.every(d => d !== null)
                    ? 'ready'
                    : ''
              }`}
              aria-label="Door lock"
            />
          )}
        </div>

        {/* Victory buttons */}
        {game.gameCompleted && (
          <div className="absolute bottom-5 right-5 z-[250] animate-fadeIn flex flex-row gap-5 items-center">
            {!isLevel2 && onNextLevel && (
              <button
                type="button"
                onClick={onNextLevel}
                className="group flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95 animate-pulse"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-4 ring-white/50 text-2xl">
                  ➡️
                </div>
                <span className="font-display text-sm tracking-widest text-white uppercase bg-emerald-600/90 px-3 py-1 rounded-lg border border-white/20">Next Level</span>
              </button>
            )}
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

