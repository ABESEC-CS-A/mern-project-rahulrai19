import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    throw error
  }
}

export default connectDB

