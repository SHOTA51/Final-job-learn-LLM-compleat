import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import fs from "fs/promises"
import path from "path"

const DATA_PATH = path.resolve(process.cwd(), "data", "chats")

async function ensureDir() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true })
  } catch {}
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  await ensureDir()
  const filePath = path.join(DATA_PATH, `${userId}.json`)
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return NextResponse.json({ chats: JSON.parse(data) })
  } catch {
    return NextResponse.json({ chats: [] })
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  await ensureDir()
  const filePath = path.join(DATA_PATH, `${userId}.json`)
  const { chats } = await request.json()
  await fs.writeFile(filePath, JSON.stringify(chats))
  return NextResponse.json({ success: true })
}
