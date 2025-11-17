"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Spinner } from "@/components/ui/spinner"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ userId: string; username: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <ChatInterface user={user} />
}
