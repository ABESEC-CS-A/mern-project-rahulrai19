const ThreadList = ({ threads, activeThreadId, onSelect }) => (
  <div className="panel">
    <div className="panel-header">
      <h2>Recent Discussions</h2>
      <p>{threads.length} active thread(s)</p>
    </div>
    <div className="thread-list">
      {threads.map((thread) => (
        <button
          key={thread._id}
          type="button"
          className={`thread-item ${thread._id === activeThreadId ? 'active' : ''}`}
          onClick={() => onSelect(thread._id)}
        >
          <div>
            <h3>{thread.title}</h3>
            <p>{thread.description.slice(0, 80)}{thread.description.length > 80 ? '…' : ''}</p>
          </div>
          <small>{thread.messages.length} replies</small>
        </button>
      ))}
      {threads.length === 0 && <p className="empty-state">No threads created yet. Be the first to start a topic!</p>}
    </div>
  </div>
)

export default ThreadList

