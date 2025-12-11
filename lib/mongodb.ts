import mongoose from 'mongoose'

// Read connection string from environment instead of hardcoding credentials
const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not defined. Using fallback mode.')
  console.log('🔧 MongoDB not configured, using fallback mode')
  // Only throw error in production if explicitly required
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: { conn: any, promise: any } = global.mongoose as any

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null } as any
}

async function connectDB() {
  // Fallback mode when MongoDB is not configured
  if (!MONGODB_URI) {
    console.log('⚠️  MongoDB not configured, using fallback mode')
    return null
  }

  if (cached.conn) {
    console.log('🔄 Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }

    console.log('🔌 Creating new MongoDB connection...')
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully!')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('🔌 MongoDB connection closed.')
  process.exit(0)
})

export default connectDB
