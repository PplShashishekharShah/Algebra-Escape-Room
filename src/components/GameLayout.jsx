import EscapeRoomBoard from './EscapeRoomBoard'
import NarrationSystem from './FeedbackToast'
import PuzzleModal from './PuzzleModal'

function GameLayout({ level, game, gameStarted, onNextLevel, isLevel2 }) {
  const currentObjectiveText = game.gameCompleted
    ? 'The door is open. Time to step into your next adventure!'
    : game.currentTargetObject?.topHintText ?? 'You found all the clues!'

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden text-inkplay">
      <EscapeRoomBoard level={level} game={game} onNextLevel={onNextLevel} isLevel2={isLevel2} />

      <NarrationSystem
        message={game.feedback.visible ? game.feedback.message : null}
        objective={currentObjectiveText}
        gameCompleted={game.gameCompleted}
        gameStarted={gameStarted}
        isMuted={game.isMuted}
        solvedCount={game.solvedCount}
        toastKey={game.toastKey}
      />

      {/* Mute Toggle Button */}
      <div className="fixed top-4 right-4 z-[300]">
        <button
          onClick={game.toggleMute}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/40 text-2xl backdrop-blur-md transition hover:scale-110 active:scale-95 border-2 border-white/20"
          aria-label={game.isMuted ? 'Unmute' : 'Mute'}
        >
          {game.isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {game.showPuzzleModal && game.activePuzzleObject ? (
        <PuzzleModal objectData={game.activePuzzleObject} game={game} />
      ) : null}

      {/* Red Flash Overlay for Wrong Answers */}
      {game.wrongFlash && <div className="red-flash-overlay" />}
    </main>
  )
}

export default GameLayout
