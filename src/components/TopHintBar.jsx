function TopHintBar({ text }) {
  return (
    <div className="relative w-full max-w-3xl">
      <img
        src="/assets/Top Hint Bar.png"
        alt="Hint bar"
        className="h-auto w-full object-contain"
      />
      <div className="absolute inset-[14%_8%_18%_8%] flex items-center justify-center text-center">
        <p className="font-display text-base text-inkplay sm:text-xl">{text}</p>
      </div>
    </div>
  )
}

export default TopHintBar
