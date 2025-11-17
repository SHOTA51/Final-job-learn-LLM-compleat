"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has a cookie (stored in browser)
    // For simplicity, redirect to /login - user will be redirected to /chat if authenticated
    router.push("/login")
  }, [router])

  return <div>Redirecting...</div>
}
