import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")
    const username = cookieStore.get("username")

    if (!userId || !username) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      userId: userId.value,
      username: username.value,
    })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
