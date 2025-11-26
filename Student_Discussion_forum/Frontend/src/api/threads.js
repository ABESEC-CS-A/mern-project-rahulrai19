import client from './client'

export const fetchThreads = (params = {}) => client.get('/threads', { params })
export const createThreadRequest = (payload) => client.post('/threads', payload)
export const fetchThreadById = (threadId) => client.get(`/threads/${threadId}`)
export const postMessageRequest = (threadId, payload) => client.post(`/threads/${threadId}/messages`, payload)

