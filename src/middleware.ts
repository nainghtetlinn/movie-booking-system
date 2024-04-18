import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

import logger from "./lib/logger"

export default withAuth(
  (req: NextRequest) => {
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
  matcher: ["/api/:path*"],
}
