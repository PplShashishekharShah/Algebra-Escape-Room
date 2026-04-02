const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function DoorCodePanel({ digits, input, onClose, onInputChange, onPadInput, onClear, onSubmit, shake }) {
  return (
    <div className="padlock-overlay">
      <div className={`padlock-container animate-popIn ${shake ? 'animate-shakeSoft' : ''}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-white/70 hover:bg-slate-700 hover:text-white"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="font-display mb-2 text-2xl text-white">Enter Door Code</h2>
        <p className="mb-6 text-sm text-white/50">Use the digits you collected</p>

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
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
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
            className="padlock-key col-span-2 text-sm uppercase tracking-widest text-red-400"
          >
            Clear
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="padlock-action btn-unlock"
        >
          Unlock Door
        </button>
      </div>
    </div>
  )
}

export default DoorCodePanel
