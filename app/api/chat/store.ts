import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'chats.json')

type Message = { id: string; role: 'user' | 'assistant' | 'system' ; content: string; timestamp: string }
type Chat = { id: string; title: string; messages: Message[]; createdAt: string }

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

async function readAll(): Promise<Record<string, Chat[]>> {
  await ensureDataFile()
  const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw || '{}')
  } catch (err) {
    return {}
  }
}

async function writeAll(data: Record<string, Chat[]>) {
  await ensureDataFile()
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function loadChatsForUser(userId: string): Promise<Chat[] | null> {
  const all = await readAll()
  return all[userId] || null
}

export async function saveChatsForUser(userId: string, chats: Chat[]) {
  const all = await readAll()
  all[userId] = chats
  await writeAll(all)
}

export async function upsertChatForUser(userId: string, chat: Chat) {
  const all = await readAll()
  const userChats = all[userId] || []
  const existingIndex = userChats.findIndex((c) => c.id === chat.id)
  if (existingIndex >= 0) {
    userChats[existingIndex] = chat
  } else {
    userChats.unshift(chat)
  }
  all[userId] = userChats
  await writeAll(all)
  return all[userId]
}

export async function deleteChatForUser(userId: string, chatId: string) {
  const all = await readAll()
  const userChats = all[userId] || []
  const remaining = userChats.filter((c) => c.id !== chatId)
  all[userId] = remaining
  await writeAll(all)
  return all[userId]
}

export async function appendMessagesToChat(userId: string, chatId: string | null, messages: Message[]) {
  const all = await readAll()
  const userChats = all[userId] || []

  let targetChat = null
  if (chatId) targetChat = userChats.find((c) => c.id === chatId)

  if (!targetChat) {
    // If a chatId was provided but not found, create a new chat with that id
    const newChat: Chat = {
      id: chatId || `chat-${Date.now()}`,
      title: 'New Conversation',
      messages: messages,
      createdAt: new Date().toISOString(),
    }
    userChats.unshift(newChat)
  } else {
    targetChat.messages.push(...messages)
  }

  all[userId] = userChats
  await writeAll(all)
  return all[userId]
}
