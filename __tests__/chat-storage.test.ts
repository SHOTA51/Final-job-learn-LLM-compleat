import { loadChats, saveChats } from '@/lib/chatStorage'

describe('chatStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads chats with dates and timestamps', () => {
    const userId = 'u-test'
    const now = new Date()
    const chats = [
      {
        id: 'c1',
        title: 'T1',
        createdAt: now,
        messages: [
          { id: 'm1', role: 'user', content: 'hi', timestamp: now },
          { id: 'm2', role: 'assistant', content: 'hello', timestamp: now },
        ],
      },
    ]

    saveChats(userId, chats)

    const loaded = loadChats(userId)
    expect(loaded).not.toBeNull()
    expect(Array.isArray(loaded)).toBe(true)
    expect(loaded![0].id).toBe('c1')
    expect(loaded![0].messages[0].timestamp instanceof Date).toBe(true)
  })
})
