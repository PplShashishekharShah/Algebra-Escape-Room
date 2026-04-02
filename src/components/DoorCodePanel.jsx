const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function DoorCodePanel({ digits, input, onClose, onInputChange, onPadInput, onClear, onSubmit, shake }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className={`animate-popIn w-full max-w-2xl rounded-[2rem] bg-white p-5 shadow-soft ${shake ? 'animate-shakeSoft' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-inkplay">Door Code Panel</p>
            <p className="mt-1 text-sm text-inkplay/70 sm:text-base">
              Enter the three digits you collected to unlock the door.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-inkplay"
          >
            Close
          </button>
        </div>

        <div className="mt-5 rounded-[1.5rem] bg-skyplay/35 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-inkplay/65">Key digits</p>
          <div className="mt-3 flex justify-center gap-3">
            {digits.map((digit, index) => (
              <div key={index} className="rounded-2xl bg-white px-5 py-3 font-display text-2xl text-jam shadow">
                {digit ?? '?'}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {input.map((digit, index) => (
            <label key={index} className="relative block h-16 w-16">
              <img
                src="/assets/Number Slot (Empty).png"
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />
              <input
                type="number"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => onInputChange(index, event.target.value)}
                className="hide-number-spin absolute inset-0 bg-transparent text-center font-display text-2xl text-inkplay outline-none"
              />
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_240px]">
          <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] bg-slate-100 p-4">
            {keypadDigits.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => onPadInput(digit)}
                className="rounded-2xl bg-white px-4 py-3 font-display text-2xl text-inkplay shadow transition hover:-translate-y-0.5 hover:bg-goldplay/80"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900 p-4 text-white">
            <img
              src="/assets/Number Pad.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-15"
            />
            <div className="relative z-10 flex h-full flex-col justify-between gap-3">
              <p className="text-sm leading-relaxed text-white/85">
                Tip: You solved the objects in order, so the digits line up from left to right.
              </p>
              <button
                type="button"
                onClick={onClear}
                className="rounded-2xl bg-white/15 px-4 py-3 font-display text-lg text-white transition hover:bg-white/25"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="rounded-2xl bg-mintplay px-4 py-3 font-display text-xl text-inkplay transition hover:scale-[1.02]"
              >
                Unlock Door
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoorCodePanel
