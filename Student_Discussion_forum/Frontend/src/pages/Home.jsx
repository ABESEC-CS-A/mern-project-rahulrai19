import { useEffect, useMemo, useState } from 'react'
import ThreadList from '../components/ThreadList'
import ThreadComposer from '../components/ThreadComposer'
import MessageBoard from '../components/MessageBoard'
import MessageInput from '../components/MessageInput'
import { useSocket } from '../hooks/useSocket'
import { createThreadRequest, fetchThreads, postMessageRequest } from '../api/threads'

const Home = () => {
  const [threads, setThreads] = useState([])
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creatingThread, setCreatingThread] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  const socket = useSocket()

  const loadThreads = async () => {
    setLoading(true)
    try {
      const { data } = await fetchThreads()
      setThreads(data)
      if (!activeThreadId && data.length) {
        setActiveThreadId(data[0]._id)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreads()
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('thread:created', (thread) => {
      setThreads((prev) => [thread, ...prev])
    })

    socket.on('message:created', ({ threadId, message }) => {
      setThreads((prev) => prev.map((thread) => {
        if (thread._id !== threadId) return thread
        return { ...thread, messages: [...thread.messages, message] }
      }))
    })

    return () => {
      socket.off('thread:created')
      socket.off('message:created')
    }
  }, [socket])

  useEffect(() => {
    if (!socket || !activeThreadId) return

    socket.emit('thread:join', activeThreadId)
    return () => socket.emit('thread:leave', activeThreadId)
  }, [socket, activeThreadId])

  const handleCreateThread = async (payload) => {
    setCreatingThread(true)
    try {
      const { data } = await createThreadRequest(payload)
      setThreads((prev) => [data, ...prev])
      setActiveThreadId(data._id)
    } finally {
      setCreatingThread(false)
    }
  }

  const handleSendMessage = async (body) => {
    if (!activeThreadId) return
    setSendingMessage(true)
    try {
      const { data } = await postMessageRequest(activeThreadId, { body })
      setThreads((prev) => prev.map((thread) => {
        if (thread._id !== activeThreadId) return thread
        return { ...thread, messages: [...thread.messages, data] }
      }))
    } finally {
      setSendingMessage(false)
    }
  }

  const activeThread = useMemo(
    () => threads.find((thread) => thread._id === activeThreadId),
    [threads, activeThreadId]
  )

  if (loading) {
    return <p className="page-loading">Loading discussions…</p>
  }

  return (
    <div className="home-grid">
      <div className="left-column">
        <ThreadComposer onSubmit={handleCreateThread} busy={creatingThread} />
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          onSelect={setActiveThreadId}
        />
      </div>
      <div className="right-column">
        <MessageBoard
          thread={activeThread}
          messages={activeThread?.messages ?? []}
        />
        <MessageInput disabled={!activeThread || sendingMessage} onSend={handleSendMessage} />
      </div>
    </div>
  )
}

export default Home