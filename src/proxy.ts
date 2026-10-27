import { NextResponse } from "next/server"
import { auth } from "@/configs/auth"

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  // 1. Allow Auth.js endpoints to pass through naturally
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // 2. Catch and validate Vercel Cron requests before session checks
  if (pathname.startsWith("/api/cron")) {
    const authHeader = req.headers.get("authorization")
    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.next()
    }
    return new NextResponse("Unauthorized Cron Attempt", { status: 401 })
  }

  // 3. Enforce authentication for all other matched routes
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Role-based access control
  if (pathname === "/dashboard/staffs" && req.auth.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/api/auth/error", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
