import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("userId")
    cookieStore.delete("username")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}
