import { NextResponse } from "next/server"
import { auth } from "@/configs/auth"

export async function GET() {
  const session = await auth()
  return NextResponse.json({ authenticated: !!session, result: JSON.stringify(session) })
}
