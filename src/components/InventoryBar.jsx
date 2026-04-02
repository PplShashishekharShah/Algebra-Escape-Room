function InventoryBar({ digits }) {
  return (
    <div className="relative w-full max-w-[21rem] self-center lg:self-start">
      <img
        src="/assets/Key Slot UI.png"
        alt="Key slot inventory"
        className="h-auto w-full object-contain"
      />
      <div className="absolute inset-[18%_10%_22%_10%] flex items-center justify-between gap-2">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20"
          >
            <img
              src="/assets/Number Slot (Empty).png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain opacity-90"
            />
            <span className="relative z-10 font-display text-2xl text-white sm:text-3xl">
              {digit ?? '?'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryBar
