import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import SessionProvider from "@/providers/server-provider"
import ThemeProvider from "@/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Booking System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <main>{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
