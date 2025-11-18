import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUser } from "../store"
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    let { username, password } = await request.json()
    username = (username || '').toString().trim()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Check if user exists (persistent store)
    const user = await getUser(username)

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Set cookie for authentication
    const cookieStore = await cookies()
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    cookieStore.set("username", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error("[login] Error:", error)
    return NextResponse.json({ error: "An error occurred during login", details: String(error) }, { status: 500 })
  }
}
