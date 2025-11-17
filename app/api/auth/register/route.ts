import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { hasUser, createUser } from "../store"

export async function POST(request: Request) {
  try {
    let { username, password } = await request.json()
    username = (username || '').toString().trim()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    if (await hasUser(username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Create new user (persistent)
    const user = await createUser(username, password)
    const userId = user.id

    // Set cookie for authentication
    const cookieStore = await cookies()
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    cookieStore.set("username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
