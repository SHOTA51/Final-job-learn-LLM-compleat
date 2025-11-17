import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { upsertChatForUser } from '../store'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const cookieUser = cookieStore.get('userId')
    const authHeader = request.headers.get('authorization') || request.headers.get('x-user-id')

    let userIdVal: string | undefined
    if (cookieUser && cookieUser.value) userIdVal = cookieUser.value
    else if (authHeader) {
      if (authHeader.startsWith('Bearer ')) userIdVal = authHeader.split(' ')[1]
      else userIdVal = authHeader
    }

    if (!userIdVal) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await request.json()
    const chat = body.chat
    if (!chat || !chat.id) return NextResponse.json({ error: 'Chat required' }, { status: 400 })

    const updated = await upsertChatForUser(userIdVal, chat)
    return NextResponse.json({ success: true, chats: updated })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
