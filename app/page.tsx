import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function Home() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")

  // Redirect based on auth status
  const redirectUrl = userId ? "/chat" : "/login"
  
  return (
    <>
      {/* Trigger client-side redirect via script to work around build-time issues */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.href = "${redirectUrl}";`,
        }}
      />
      <div>Redirecting...</div>
    </>
  )
}
