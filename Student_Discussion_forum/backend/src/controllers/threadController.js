import { StatusCodes } from 'http-status-codes'
import Thread from '../models/Thread.js'
import { createThreadSchema, messageSchema } from '../validators/threadSchemas.js'
import { emitThreadCreated, emitMessageCreated } from '../utils/socketEmitter.js'

export const listThreads = async (req, res, next) => {
  try {
    const { category, q } = req.query
    const filters = {}
    if (category) filters.category = category
    if (q) filters.title = { $regex: q, $options: 'i' }

    const threads = await Thread.find(filters)
      .sort({ lastActivityAt: -1 })
      .populate('createdBy', 'fullName avatarColor')
      .populate('messages.author', 'fullName avatarColor')
      .limit(25)

    res.json(threads)
  } catch (error) {
    next(error)
  }
}

export const createThread = async (req, res, next) => {
  try {
    const data = createThreadSchema.parse(req.body)

    const thread = await Thread.create({
      ...data,
      createdBy: req.user._id,
      participants: [req.user._id]
    })

    const populated = await thread.populate('createdBy', 'fullName avatarColor')

    emitThreadCreated(populated)

    res.status(StatusCodes.CREATED).json(populated)
  } catch (error) {
    next(error)
  }
}

export const getThreadById = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId)
      .populate('createdBy', 'fullName avatarColor')
      .populate('messages.author', 'fullName avatarColor')

    if (!thread) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Thread not found' })
    }

    res.json(thread)
  } catch (error) {
    next(error)
  }
}

export const addMessage = async (req, res, next) => {
  try {
    const payload = messageSchema.parse(req.body)

    const thread = await Thread.findById(req.params.threadId)
    if (!thread) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Thread not found' })
    }

    if (thread.isClosed) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Thread has been closed' })
    }

    const message = {
      author: req.user._id,
      body: payload.body
    }

    thread.messages.push(message)
    thread.participants.addToSet(req.user._id)
    await thread.save()

    await thread.populate('messages.author', 'fullName avatarColor')

    const latestMessage = thread.messages[thread.messages.length - 1]
    emitMessageCreated(thread._id, latestMessage)

    res.status(StatusCodes.CREATED).json(latestMessage)
  } catch (error) {
    next(error)
  }
}

