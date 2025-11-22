import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI
  if (!uri) throw new Error('Missing MONGODB_URI or MONGO_URI in environment')
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}
