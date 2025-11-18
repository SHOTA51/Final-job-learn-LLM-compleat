import { MongoClient, Db } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Please define MONGODB_URI environment variable')
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    tls: false,
    monitorCommands: false,
    retryWrites: false,
  })

  try {
    await client.connect()
    const db = client.db()
    
    console.log('[mongodb] Connected successfully')
    
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error('[mongodb] Connection error:', error)
    throw error
  }
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
  }
}
