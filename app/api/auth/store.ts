import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'users.json')

type User = { username: string; password: string; id: string }

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

async function ensureDataFile() {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true })
    try {
      await fs.promises.access(DATA_FILE)
    } catch (e) {
      await fs.promises.writeFile(DATA_FILE, JSON.stringify({}), 'utf8')
    }
  } catch (err) {
    // ignore
  }
}

async function readAll(): Promise<Record<string, User>> {
  await ensureDataFile()
  const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw || '{}')
  } catch (err) {
    return {}
  }
}

async function writeAll(data: Record<string, User>) {
  await ensureDataFile()
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function getUser(username: string): Promise<User | undefined> {
  const all = await readAll()
  const key = normalizeUsername(username)
  return all[key]
}

export async function hasUser(username: string): Promise<boolean> {
  const all = await readAll()
  const key = normalizeUsername(username)
  return !!all[key]
}

export async function createUser(username: string, password: string): Promise<User> {
  const all = await readAll()
  const key = normalizeUsername(username)
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const hashed = bcrypt.hashSync(password, 10)
  const user: User = { username: username.trim(), password: hashed, id: userId }
  all[key] = user
  await writeAll(all)
  return user
}

export async function listUsers(): Promise<Array<{ id: string; username: string }>> {
  const all = await readAll()
  return Object.values(all).map((u) => ({ id: u.id, username: u.username }))
}
