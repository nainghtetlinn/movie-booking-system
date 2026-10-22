import { NextResponse } from "next/server"
import { auth } from "@/configs/auth"

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/dashboard/staffs" && req.auth.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/api/auth/error", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
