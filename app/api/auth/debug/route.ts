import { NextResponse } from 'next/server'
import { listUsers } from '../store'

// WARNING: Dev-only debug route. Do NOT enable in production.
export async function GET() {
  try {
    const list = await listUsers()
    return NextResponse.json({ users: list })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
