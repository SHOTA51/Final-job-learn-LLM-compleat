import { generateText } from "ai"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { loadChatsForUser, appendMessagesToChat } from "./store"

export async function GET(request: Request) {
  try {
    // support authentication by cookie or by header for dev/testing
    const cookieStore = await cookies()
    const cookieUser = cookieStore.get("userId")
    const authHeader = request.headers.get('authorization') || request.headers.get('x-user-id')

    let userIdVal: string | undefined
    if (cookieUser && cookieUser.value) userIdVal = cookieUser.value
    else if (authHeader) {
      if (authHeader.startsWith('Bearer ')) userIdVal = authHeader.split(' ')[1]
      else userIdVal = authHeader
    }

    if (!userIdVal) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const chats = await loadChatsForUser(userIdVal)
    return NextResponse.json({ chats: chats || [] })
  } catch (err) {
    return NextResponse.json({ error: "Failed to load chats" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication (cookie or header fallback for dev/testing)
    const cookieStore = await cookies()
    const cookieUser = cookieStore.get("userId")
    const authHeader = request.headers.get('authorization') || request.headers.get('x-user-id')

    let userIdVal: string | undefined
    if (cookieUser && cookieUser.value) userIdVal = cookieUser.value
    else if (authHeader) {
      if (authHeader.startsWith('Bearer ')) userIdVal = authHeader.split(' ')[1]
      else userIdVal = authHeader
    }

    if (!userIdVal) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { message, chatId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Prefer OpenAI if configured via env
    let text: string | undefined
    const systemPrompt = `นายคือผู้เชี่ยวชาญการแนะนำเรื่องการศึกษาต่อในประเทศไทย (ถ้าถามต่างประเทศก็ตอบได้) และด้านการหางานก็แนะนำได้หรือเกี่ยวกับการเติบโตด้านอาชีพทั้งในไทยและต่างประเทศโดยเขียนภาษาที่คุยง่ายสำหรับเด็ก ม.ปลาย และมหาลัย `

    if (process.env.OPENAI_API_KEY) {
      try {
        const base = (process.env.OPENAI_API_BASE || "https://api.openai.com").trim()
        // allow user to provide a full endpoint (including /chat/completions), or just a base
        const endpoint = base.includes('/chat/completions') ? base : base.includes('/v1/') ? base : `${base.replace(/\/$/, '')}/v1/chat/completions`
        const model = (process.env.OPENAI_MODEL || 'gpt-3.5-turbo').trim()

        const payload = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 5000,
          temperature: 0.2,
        }

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(payload),
        })

        if (!resp.ok) {
          const errText = await resp.text()
          console.error('[v0] OpenAI API error:', resp.status, errText)
          throw new Error('OpenAI API error')
        }

        const j = await resp.json()
        // chat/completions: choices[0].message.content
        text = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || ''
      } catch (openaiErr) {
        console.error('[v0] OpenAI generation error:', openaiErr)
        const fallback =
          "ขอโทษครับ ขณะนี้ยังไม่สามารถเชื่อมต่อกับบริการ AI ได้ ผมจะช่วยแนะนำแบบทั่วไป: ลองเริ่มจากการเตรียมประวัติการศึกษาและประสบการณ์ ทำเรซูเม่ให้ชัดเจน และเน้นทักษะที่เกี่ยวข้องกับงานที่ต้องการครับ."
        text = fallback
      }
    } else {
      // The Gateway automatically handles API keys and routing (fallback)
      try {
        const result = await generateText({
          model: "google/gemini-2.5-flash-image",
          system: systemPrompt,
          prompt: message,
          maxOutputTokens: 2000,
        })
        text = (result as any).text ?? (result as any).response ?? undefined
      } catch (aiErr: any) {
        console.error('[v0] AI generation error (detailed):', aiErr)
        const fallback =
          "ขอโทษครับ ขณะนี้ยังไม่สามารถเชื่อมต่อกับบริการ AI ได้ ผมจะช่วยแนะนำแบบทั่วไป: ลองเริ่มจากการเตรียมประวัติการศึกษาและประสบการณ์ ทำเรซูเม่ให้ชัดเจน และเน้นทักษะที่เกี่ยวข้องกับงานที่ต้องการครับ."
        text = fallback
      }
    }
    // persist messages server-side
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    }

    const assistantMsg = {
      id: `assistant-${Date.now()}`,
      role: 'assistant' as const,
      content: text || "I'm sorry, chat gpt couldn't process that request.",
      timestamp: new Date().toISOString(),
    }

    try {
      await appendMessagesToChat(userIdVal, chatId || null, [userMsg, assistantMsg])
    } catch (e) {
      console.error('Failed to persist chat messages', e)
    }

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("chat gpt AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
