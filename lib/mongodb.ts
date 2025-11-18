import { MongoClient, Db } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null
let connectionPromise: Promise<{ client: MongoClient; db: Db }> | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      // Verify client is still connected
      await cachedDb.admin().ping()
      return { client: cachedClient, db: cachedDb }
    } catch (e) {
      // Connection dead, reset
      cachedClient = null
      cachedDb = null
      connectionPromise = null
    }
  }

  // Prevent multiple concurrent connections
  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = (async () => {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error('Please define MONGODB_URI environment variable')
    }

    const client = new MongoClient(uri, {
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 5000,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      tls: false,
      retryWrites: false,
      heartbeatFrequencyMS: 30000,
    })

    try {
      await client.connect()
      const db = client.db()

      cachedClient = client
      cachedDb = db
      console.log('[mongodb] Connected successfully')

      return { client, db }
    } catch (error) {
      console.error('[mongodb] Connection error:', error)
      connectionPromise = null
      throw error
    }
  })()

  return connectionPromise
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
    connectionPromise = null
  }
}
