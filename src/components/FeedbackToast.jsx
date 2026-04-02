function FeedbackToast({ message, type, visible }) {
  if (!visible || !message) {
    return null
  }

  const toneClass = {
    success: 'bg-mintplay text-inkplay',
    error: 'bg-jam text-white',
    info: 'bg-white text-inkplay',
  }[type]

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div className={`animate-popIn rounded-full px-5 py-3 text-center shadow-soft ${toneClass}`}>
        {message}
      </div>
    </div>
  )
}

export default FeedbackToast
