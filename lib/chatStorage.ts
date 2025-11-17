export function loadChats(userId: string) {
  const saved = localStorage.getItem(`chats_${userId}`)
  if (!saved) return null
  try {
    const parsed = JSON.parse(saved)
    return parsed.map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      messages: chat.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }))
  } catch (err) {
    console.error('Failed to parse chats from storage', err)
    return null
  }
}

export function saveChats(userId: string, chats: any) {
  localStorage.setItem(`chats_${userId}`, JSON.stringify(chats))
}
