import { useState } from 'react'

const MessageInput = ({ disabled, onSend }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed).then(() => setValue(''))
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        name="message"
        rows="2"
        placeholder={disabled ? 'Select a thread to start typing...' : 'Share your thoughts...'}
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="primary" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  )
}

export default MessageInput

