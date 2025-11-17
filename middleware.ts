import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Only handle root path
  if (request.nextUrl.pathname === "/") {
    // Check for userId cookie
    const userId = request.cookies.get("userId")

    // Redirect based on auth status
    if (userId) {
      return NextResponse.redirect(new URL("/chat", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
