import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Home() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")

  if (userId) {
    redirect("/chat")
  } else {
    redirect("/login")
  }
}
