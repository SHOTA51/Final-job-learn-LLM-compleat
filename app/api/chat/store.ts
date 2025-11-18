import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: string }
type Chat = { _id?: ObjectId; id: string; userId: string; title: string; messages: Message[]; createdAt: string }

export async function loadChatsForUser(userId: string): Promise<Chat[] | null> {
  const db = await getDatabase()
  const chats = await db.collection('chats').find({ userId }).sort({ createdAt: -1 }).toArray()
  return chats.length > 0 ? (chats as Chat[]) : null
}

export async function saveChatsForUser(userId: string, chats: Chat[]) {
  const db = await getDatabase()
  for (const chat of chats) {
    await db.collection('chats').updateOne(
      { id: chat.id, userId },
      { $set: chat },
      { upsert: true }
    )
  }
}

export async function upsertChatForUser(userId: string, chat: Chat) {
  const db = await getDatabase()
  chat.userId = userId
  await db.collection('chats').updateOne(
    { id: chat.id, userId },
    { $set: chat },
    { upsert: true }
  )
  const result = await db.collection('chats').findOne({ id: chat.id, userId })
  return result ? [result as Chat] : []
}

export async function deleteChatForUser(userId: string, chatId: string) {
  const db = await getDatabase()
  await db.collection('chats').deleteOne({ id: chatId, userId })
  const remaining = await db.collection('chats').find({ userId }).sort({ createdAt: -1 }).toArray()
  return remaining as Chat[]
}

export async function appendMessagesToChat(userId: string, chatId: string | null, messages: Message[]) {
  const db = await getDatabase()

  if (!chatId) {
    // Create new chat
    chatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: chatId,
      userId,
      title: 'New Conversation',
      messages,
      createdAt: new Date().toISOString(),
    }
    await db.collection('chats').insertOne(newChat)
  } else {
    // Append to existing chat
    await db.collection('chats').updateOne(
      { id: chatId, userId },
      { $push: { messages: { $each: messages } } },
      { upsert: true }
    )
  }

  const result = await db.collection('chats').findOne({ id: chatId, userId })
  return result ? [result as Chat] : []
}
