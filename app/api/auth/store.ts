import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

type User = { username: string; password: string; id: string }

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

export async function getUser(username: string): Promise<User | undefined> {
  const key = normalizeUsername(username)
  const rows: any = await query('SELECT * FROM users WHERE username = ? LIMIT 1', [key])
  return rows.length > 0 ? rows[0] : undefined
}

export async function hasUser(username: string): Promise<boolean> {
  const key = normalizeUsername(username)
  const rows: any = await query('SELECT 1 FROM users WHERE username = ? LIMIT 1', [key])
  return rows.length > 0
}

export async function createUser(username: string, password: string): Promise<User> {
  const key = normalizeUsername(username)
  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  const hashed = bcrypt.hashSync(password, 10)
  await query('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [userId, key, hashed])
  return { username: key, password: hashed, id: userId }
}

export async function listUsers(): Promise<Array<{ id: string; username: string }>> {
  const rows: any = await query('SELECT id, username FROM users')
  return rows.map((r: any) => ({ id: r.id, username: r.username }))
}
