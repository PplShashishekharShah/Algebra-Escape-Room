import React from 'react'
import DoorCodePanel from './DoorCodePanel'
import EscapeRoomBoard from './EscapeRoomBoard'
import FeedbackToast from './FeedbackToast'
import InventoryBar from './InventoryBar'
import PuzzleModal from './PuzzleModal'
import SuccessOverlay from './SuccessOverlay'
import TopHintBar from './TopHintBar'

function GameLayout({ level, game }) {
  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden text-inkplay">
      <EscapeRoomBoard level={level} game={game} />

      <div className="hint-bar-container">
        <TopHintBar
          text={
            game.gameCompleted
              ? 'The door is open. Time to step into your next adventure!'
              : game.currentTargetObject?.topHintText ?? 'You found all the clues!'
          }
        />
      </div>

      <div className="inventory-container">
        <InventoryBar digits={game.collectedDigits} />
      </div>

      <header className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center opacity-80 transition hover:opacity-100">
        <p className="font-display text-xs uppercase tracking-[0.8em] text-white/90 font-bold">
          Algebra Escape Room
        </p>
        <h1 className="text-stroke-soft font-display text-2xl text-white">
          Crack the clues. Collect the digits. Escape.
        </h1>
      </header>

      <FeedbackToast
        key={game.toastKey}
        message={game.feedback.message}
        type={game.feedback.type}
        visible={game.feedback.visible}
      />

      {game.showPuzzleModal && game.activePuzzleObject ? (
        <PuzzleModal objectData={game.activePuzzleObject} game={game} />
      ) : null}

      {game.showDoorPanel ? (
        <DoorCodePanel
          digits={game.collectedDigits}
          input={game.doorCodeInput}
          onClose={game.closeDoorPanel}
          onInputChange={game.setDoorDigit}
          onPadInput={game.handleDoorPadInput}
          onClear={game.clearDoorInput}
          onSubmit={game.verifyDoorCode}
          shake={game.wrongPulse}
        />
      ) : null}

      {game.gameCompleted ? <SuccessOverlay onReplay={game.resetGame} /> : null}
    </main>
  )
}

export default GameLayout
