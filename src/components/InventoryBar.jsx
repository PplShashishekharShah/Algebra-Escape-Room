function InventoryBar({ digits }) {
  return (
    <div className="inventory-bar-wrapper">
      <span className="inventory-label">🗝️ Your Keys</span>
      <div className="relative w-full flex items-center justify-around gap-2 px-2 py-1">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="relative flex h-14 w-12 items-center justify-center sm:h-16 sm:w-14"
          >
            <img
              src="/assets/Number Slot (Empty).png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain opacity-90 shadow-lg"
            />
            <span className="relative z-10 font-display text-xl text-white sm:text-2xl">
              {digit ?? '?'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryBar
