function FeedbackToast({ message, type, visible }) {
  if (!visible || !message) {
    return null
  }

  return (
    <div className="feedback-rat-container animate-slideUp">
      <img 
        src="/assets/Rat_character.png" 
        alt="Detective Rat" 
        className="rat-character"
      />
      <div className="speech-bubble-container">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default FeedbackToast
