import React from 'react'

function DoorCodePanel({ digits, input, onPadInput, onClear, onSubmit, shake }) {
  return (
    <div className="padlock-overlay">
      <div className={`padlock-container ${shake ? 'animate-shakeSoft' : ''}`}>
        
        <div className="padlock-display">
          {input.map((digit, index) => (
            <div key={index} className="padlock-slot">
              {digit || (
                <span className="opacity-20">?</span>
              )}
            </div>
          ))}
        </div>

        <div className="padlock-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => onPadInput(digit)}
              className="padlock-key font-black text-4xl text-white"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="padlock-key font-black text-base text-red-500"
          >
            CLR
          </button>
          <button
            key="0"
            type="button"
            onClick={() => onPadInput('0')}
            className="padlock-key font-black text-4xl text-white"
          >
            0
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="padlock-key font-black text-base text-green-500"
          >
            OK
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="padlock-action-btn"
        >
          Unlock Door
        </button>
      </div>
    </div>
  )
}

export default DoorCodePanel
