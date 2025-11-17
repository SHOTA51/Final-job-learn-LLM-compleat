import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteChatForUser } from '../store'

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
    const chatId = body.chatId
    if (!chatId) return NextResponse.json({ error: 'chatId required' }, { status: 400 })

    const updated = await deleteChatForUser(userIdVal, chatId)
    return NextResponse.json({ success: true, chats: updated })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
