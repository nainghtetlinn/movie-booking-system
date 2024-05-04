import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

import logger from "./lib/logger"

export default withAuth(
  (req) => {
    logger.info("middleware > token > username ... ", req.nextauth.token?.username)
    logger.info("middleware > token > role     ... ", req.nextauth.token?.role)
    logger.info("middleware > pathname", req.nextUrl.pathname)
    if (req.nextUrl.pathname === "/dashboard/staffs" && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("api/auth/error", req.nextUrl.origin))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
