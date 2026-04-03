import DoorCodePanel from './DoorCodePanel'
import EscapeRoomBoard from './EscapeRoomBoard'
import NarrationSystem from './FeedbackToast'
import InventoryBar from './InventoryBar'
import PuzzleModal from './PuzzleModal'

function GameLayout({ level, game }) {
  const currentObjectiveText = game.gameCompleted
    ? 'The door is open. Time to step into your next adventure!'
    : game.currentTargetObject?.topHintText ?? 'You found all the clues!'

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden text-inkplay">
      <EscapeRoomBoard level={level} game={game} />

      <div className="inventory-container">
        <InventoryBar digits={game.collectedDigits} />
      </div>

      <NarrationSystem
        message={game.feedback.visible ? game.feedback.message : null}
        objective={currentObjectiveText}
        gameCompleted={game.gameCompleted}
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
    </main>
  )
}

export default GameLayout
