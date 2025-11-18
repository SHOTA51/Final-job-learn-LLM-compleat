import { query } from '@/lib/db'

type Message = { id?: number; role: 'user' | 'assistant' | 'system'; content: string; timestamp: string }
type Chat = { id: string; userId: string; title: string; messages: Message[]; createdAt: string }

export async function loadChatsForUser(userId: string): Promise<Chat[] | null> {
  const chats: any = await query('SELECT id, userId, title, createdAt FROM chats WHERE userId = ? ORDER BY createdAt DESC', [userId])
  if (chats.length === 0) return null

  const results: Chat[] = []
  for (const c of chats) {
    const messages: any = await query('SELECT role, content, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [c.id])
    results.push({ id: c.id, userId: c.userId, title: c.title, messages: messages.map((m: any) => ({ role: m.role, content: m.content, timestamp: m.timestamp })), createdAt: c.createdAt })
  }
  return results
}

export async function saveChatsForUser(userId: string, chats: Chat[]) {
  for (const chat of chats) {
    await query('INSERT INTO chats (id, userId, title, createdAt) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), createdAt = VALUES(createdAt)', [chat.id, userId, chat.title, chat.createdAt])
    // replace messages
    await query('DELETE FROM messages WHERE chatId = ?', [chat.id])
    for (const m of chat.messages) {
      await query('INSERT INTO messages (chatId, role, content, timestamp) VALUES (?, ?, ?, ?)', [chat.id, m.role, m.content, m.timestamp])
    }
  }
}

export async function upsertChatForUser(userId: string, chat: Chat) {
  await query('INSERT INTO chats (id, userId, title, createdAt) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), createdAt = VALUES(createdAt)', [chat.id, userId, chat.title, chat.createdAt])
  // replace messages for this chat
  await query('DELETE FROM messages WHERE chatId = ?', [chat.id])
  for (const m of chat.messages) {
    await query('INSERT INTO messages (chatId, role, content, timestamp) VALUES (?, ?, ?, ?)', [chat.id, m.role, m.content, m.timestamp])
  }
  const rows: any = await query('SELECT id, userId, title, createdAt FROM chats WHERE id = ? AND userId = ? LIMIT 1', [chat.id, userId])
  if (rows.length === 0) return []
  const messages: any = await query('SELECT role, content, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [chat.id])
  return [{ id: rows[0].id, userId: rows[0].userId, title: rows[0].title, messages: messages.map((m: any) => ({ role: m.role, content: m.content, timestamp: m.timestamp })), createdAt: rows[0].createdAt }]
}

export async function deleteChatForUser(userId: string, chatId: string) {
  await query('DELETE FROM messages WHERE chatId = ?', [chatId])
  await query('DELETE FROM chats WHERE id = ? AND userId = ?', [chatId, userId])
  const remaining: any = await query('SELECT id, userId, title, createdAt FROM chats WHERE userId = ? ORDER BY createdAt DESC', [userId])
  const results: Chat[] = []
  for (const c of remaining) {
    const messages: any = await query('SELECT role, content, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [c.id])
    results.push({ id: c.id, userId: c.userId, title: c.title, messages: messages.map((m: any) => ({ role: m.role, content: m.content, timestamp: m.timestamp })), createdAt: c.createdAt })
  }
  return results
}

export async function appendMessagesToChat(userId: string, chatId: string | null, messages: Message[]) {
  if (!chatId) {
    chatId = `chat-${Date.now()}`
    const createdAt = new Date().toISOString()
    await query('INSERT INTO chats (id, userId, title, createdAt) VALUES (?, ?, ?, ?)', [chatId, userId, 'New Conversation', createdAt])
    for (const m of messages) {
      await query('INSERT INTO messages (chatId, role, content, timestamp) VALUES (?, ?, ?, ?)', [chatId, m.role, m.content, m.timestamp])
    }
  } else {
    for (const m of messages) {
      await query('INSERT INTO messages (chatId, role, content, timestamp) VALUES (?, ?, ?, ?)', [chatId, m.role, m.content, m.timestamp])
    }
  }

  const rows: any = await query('SELECT id, userId, title, createdAt FROM chats WHERE id = ? AND userId = ? LIMIT 1', [chatId, userId])
  if (rows.length === 0) return []
  const msgs: any = await query('SELECT role, content, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [chatId])
  return [{ id: rows[0].id, userId: rows[0].userId, title: rows[0].title, messages: msgs.map((m: any) => ({ role: m.role, content: m.content, timestamp: m.timestamp })), createdAt: rows[0].createdAt }]
}
