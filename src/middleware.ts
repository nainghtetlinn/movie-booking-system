import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

import logger from "./lib/logger"

export default withAuth(
  (req) => {
    logger.info("middleware > token > username ... ", req.nextauth.token?.username)
    logger.info("middleware > token > role     ... ", req.nextauth.token?.role)
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
