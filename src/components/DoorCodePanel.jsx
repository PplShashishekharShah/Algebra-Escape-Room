import React, { useEffect } from 'react'

function DoorCodePanel({ digits, input, onPadInput, onClear, onSubmit, shake, onClose }) {
  // Global keyboard listener for Enter and numbers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onSubmit()
      } else if (e.key >= '0' && e.key <= '9') {
        onPadInput(e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        onClear()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPadInput, onClear, onSubmit, onClose])

  return (
    <div className="padlock-overlay">
      <div className={`padlock-container ${shake ? 'animate-shakeSoft' : ''}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg z-50 text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="padlock-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => onPadInput(digit)}
              className="padlock-key"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="padlock-key text-red-400 text-lg"
          >
            CLR
          </button>
          <button
            key="0"
            type="button"
            onClick={() => onPadInput('0')}
            className="padlock-key"
          >
            0
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="padlock-key text-green-400 text-lg"
          >
            OK
          </button>
        </div>

      </div>
    </div>
  )
}

export default DoorCodePanel
