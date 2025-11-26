import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { addMessage, createThread, getThreadById, listThreads } from '../controllers/threadController.js'

const router = Router()

router.get('/', authenticate, listThreads)
router.post('/', authenticate, createThread)
router.get('/:threadId', authenticate, getThreadById)
router.post('/:threadId/messages', authenticate, addMessage)

export default router

