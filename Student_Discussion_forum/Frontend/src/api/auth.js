import client from './client'

export const loginRequest = (payload) => client.post('/auth/login', payload)
export const registerRequest = (payload) => client.post('/auth/register', payload)

