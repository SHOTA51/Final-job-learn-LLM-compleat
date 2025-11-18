import { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'

type User = { _id?: ObjectId; username: string; password: string; id: string }

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

export async function getUser(username: string): Promise<User | undefined> {
  const db = await getDatabase()
  const key = normalizeUsername(username)
  const user = await db.collection('users').findOne({ username: key })
  return user ? user : undefined
}

export async function hasUser(username: string): Promise<boolean> {
  const db = await getDatabase()
  const key = normalizeUsername(username)
  const user = await db.collection('users').findOne({ username: key })
  return !!user
}

export async function createUser(username: string, password: string): Promise<User> {
  const db = await getDatabase()
  const key = normalizeUsername(username)
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const hashed = bcrypt.hashSync(password, 10)
  const user: User = { username: key, password: hashed, id: userId }
  
  await db.collection('users').insertOne(user)
  return user
}

export async function listUsers(): Promise<Array<{ id: string; username: string }>> {
  const db = await getDatabase()
  const users = await db.collection('users').find({}).toArray()
  return users.map((u: any) => ({ id: u.id, username: u.username }))
}
