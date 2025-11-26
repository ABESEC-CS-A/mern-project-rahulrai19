const MessageBoard = ({ thread, messages }) => {
  if (!thread) {
    return (
      <div className="panel message-board">
        <div className="empty-state">
          <h3>Select a thread</h3>
          <p>Pick a topic on the left to view the conversation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel message-board">
      <div className="panel-header">
        <h2>{thread.title}</h2>
        <p>{thread.description}</p>
        <div className="tag-list">
          {thread.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
        </div>
      </div>
      <div className="message-scroll">
        {messages.map((message) => (
          <div key={message._id} className="message">
            <div
              className="avatar"
              style={{ backgroundColor: message.author?.avatarColor ?? '#4c1d95' }}
            >
              {message.author?.fullName?.[0] ?? '?'}
            </div>
            <div>
              <div className="message-meta">
                <strong>{message.author?.fullName ?? 'Unknown'}</strong>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
              <p>{message.body}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="empty-state">No replies yet. Start the conversation!</p>
        )}
      </div>
    </div>
  )
}

export default MessageBoard

