import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/configs/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  return NextResponse.json({ authenticated: !!session, result: JSON.stringify(session) })
}
