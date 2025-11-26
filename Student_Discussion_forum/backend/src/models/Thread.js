import mongoose from 'mongoose'

const { Schema } = mongoose

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  attachments: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true })

const threadSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  category: {
    type: String,
    default: 'general'
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  isClosed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

threadSchema.pre('save', function updateActivity (next) {
  if (this.isModified('messages')) {
    this.lastActivityAt = new Date()
  }
  next()
})

const Thread = mongoose.model('Thread', threadSchema)

export default Thread

