"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Briefcase,
  GraduationCap,
  LogOut,
  Send,
  User,
  Bot,
  Menu,
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Newspaper,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface ChatInterfaceProps {
  user: {
    userId: string
    username: string
  }
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "default",
      title: "New Conversation",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `ยินดีที่ได้รู้จักนะ ฉันคือผู้ที่จะช่วยแนะนำเรื่องการเรียนต่อและการทำงาน ไม่ว่าจะเป็นน้องๆ ม.ปลายที่กำลังคิดว่าจะเรียนต่ออะไรดี หรือพี่ๆ มหาลัยที่เริ่มมองหางานแรก หรืออยากจะวางแผนอนาคตให้ปังกว่าเดิม ทั้งในไทยและต่างประเทศ ฉันพร้อมให้คำปรึกษาแบบเข้าใจง่าย ไม่มีศัพท์ยากๆ แน่นอน!

อยากรู้เรื่องอะไร ถามมาได้เลยนะ ไม่ต้องเกรงใจ! 😊`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ])
  const [currentChatId, setCurrentChatId] = useState("default")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find((chat) => chat.id === currentChatId)
  const messages = currentChat?.messages || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // server-side chat storage
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chat")
        if (res.ok) {
          const data = await res.json()
          if (data.chats && data.chats.length > 0) {
            // convert date strings back to Date objects
            const loaded = data.chats.map((chat: any) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              messages: chat.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
            }))
            setChats(loaded)
            setCurrentChatId(loaded[0].id)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load chats from server:", error)
      }
    }
    fetchChats()
  }, [user.userId])

  // server-side persistence is handled when sending messages (POST /api/chat)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `ยินดีที่ได้รู้จักนะ ฉันคือผู้ที่จะช่วยแนะนำเรื่องการเรียนต่อและการทำงาน ไม่ว่าจะเป็นน้องๆ ม.ปลายที่กำลังคิดว่าจะเรียนต่ออะไรดี หรือพี่ๆ มหาลัยที่เริ่มมองหางานแรก หรืออยากจะวางแผนอนาคตให้ปังกว่าเดิม ทั้งในไทยและต่างประเทศ ฉันพร้อมให้คำปรึกษาแบบเข้าใจง่าย ไม่มีศัพท์ยากๆ แน่นอน!

อยากรู้เรื่องอะไร ถามมาได้เลยนะ ไม่ต้องเกรงใจ! 😊`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setSidebarOpen(false)
    // persist new chat to server so server knows this chat id (prevent later merging)
    fetch('/api/chat/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat: { ...newChat, createdAt: newChat.createdAt.toISOString(), messages: newChat.messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })) } }),
    }).catch((e) => console.error('[v0] Failed to save new chat to server', e))
  }

  const handleDeleteChat = (chatId: string) => {
    // update local state immediately
    const newChats = chats.length === 1
      ? [
          {
            id: "default",
            title: "New Conversation",
            messages: [
              {
                id: "welcome",
                role: "assistant" as const,
                content: `
ยินดีที่ได้รู้จักนะ ฉันคือผู้ที่จะช่วยแนะนำเรื่องการเรียนต่อและการทำงาน ไม่ว่าจะเป็นน้องๆ ม.ปลายที่กำลังคิดว่าจะเรียนต่ออะไรดี หรือพี่ๆ มหาลัยที่เริ่มมองหางานแรก หรืออยากจะวางแผนอนาคตให้ปังกว่าเดิม ทั้งในไทยและต่างประเทศ ฉันพร้อมให้คำปรึกษาแบบเข้าใจง่าย ไม่มีศัพท์ยากๆ แน่นอน!

อยากรู้เรื่องอะไร ถามมาได้เลยนะ ไม่ต้องเกรงใจ! 😊
`,
                timestamp: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]
      : chats.filter((chat) => chat.id !== chatId)

    setChats(newChats)
    if (currentChatId === chatId) {
      setCurrentChatId(newChats[0]?.id || "default")
    }

    // persist delete to server (dev-friendly via x-user-id or cookie)
    fetch('/api/chat/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
    }).catch((e) => console.error('[v0] Failed to delete chat on server', e))
  }

  const handleStartRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      const updatedChats = chats.map((chat) => (chat.id === chatId ? { ...chat, title: editingTitle.trim() } : chat))
      setChats(updatedChats)

      // persist updated chat title to server
      const chatToSave = updatedChats.find((c) => c.id === chatId)
      if (chatToSave) {
        fetch('/api/chat/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat: { ...chatToSave, createdAt: chatToSave.createdAt.toISOString(), messages: chatToSave.messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })) } }),
        }).catch((e) => console.error('[v0] Failed to save renamed chat to server', e))
      }
    }
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleCancelRename = () => {
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages, userMessage]
          const title =
            chat.messages.length === 1 ? input.trim().slice(0, 50) + (input.length > 50 ? "..." : "") : chat.title
          return { ...chat, messages: updatedMessages, title }
        }
        return chat
      }),
    )

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim(), chatId: currentChatId }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, messages: [...chat.messages, assistantMessage] } : chat,
        ),
      )
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, messages: [...chat.messages, errorMessage] } : chat,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const ChatListContent = () => (
    <>
      <div className="p-3 border-b">
        <Button onClick={handleNewChat} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 p-3 rounded-lg transition-colors ${
                currentChatId === chat.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              {editingChatId === chat.id ? (
                <>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveRename(chat.id)
                      } else if (e.key === "Escape") {
                        handleCancelRename()
                      }
                    }}
                    className="flex-1 h-7 text-sm"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleSaveRename(chat.id)}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancelRename}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCurrentChatId(chat.id)
                      setSidebarOpen(false)
                    }}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {chat.title}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartRename(chat.id, chat.title)
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id)
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <aside className="hidden lg:flex lg:flex-col w-80 border-r bg-white/80 backdrop-blur-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatListContent />
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Chat History</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-[calc(100vh-5rem)]">
                    <ChatListContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Job & Education Guide</h1>
                <p className="text-xs text-muted-foreground">Your AI Career Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push("/learning-paths")}>
                <Newspaper className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">ข่าวสาร</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                <Plus className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">New Chat</span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 mt-1 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600">
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Card
                    className={`px-4 py-3 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </Card>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 mt-1 shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="px-4 py-3 bg-card border-border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers, education, job search..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
