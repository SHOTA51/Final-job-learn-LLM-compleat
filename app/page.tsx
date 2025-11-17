'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Default redirect to login
    // Login page will auto-redirect to /chat if user is authenticated
    const timer = setTimeout(() => {
      router.replace('/login')
    }, 100)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {isClient && <p className="text-gray-500">Redirecting...</p>}
    </div>
  )
}
