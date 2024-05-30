"use client"

import DarkModeBtn from "@/components/DarkModeBtn"
import Profile from "@/components/Profile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Clapperboard, Film, Home, Menu, Ticket, Users } from "lucide-react"
import Link from "next/link"

import { useScrollDirection } from "@/hooks/useScrollDirection"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

const Nav = () => {
  const path = usePathname()
  const direction = useScrollDirection()

  return (
    <>
      <nav
        className={clsx(
          "sticky left-0 right-0 top-0 z-50 border-b bg-background transition-[padding] duration-500 sm:hidden",
          direction == "up" && "py-4",
        )}>
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <SideNav path={path} />
            <h4 className="text-lg font-semibold">MBS Dashboard</h4>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeBtn />
            <Profile />
          </div>
        </div>
      </nav>
    </>
  )
}

const links = [
  { href: "/dashboard", title: "Dashboard", icon: Home },
  { href: "/dashboard/movies", title: "Movies", icon: Film },
  { href: "/dashboard/shows", title: "Shows", icon: Clapperboard },
  { href: "/dashboard/bookings", title: "Bookings", icon: Ticket },
  { href: "/dashboard/staffs", title: "Staffs", icon: Users },
]

const SideNav = ({ path }: { path: string }) => {
  const session = useSession()

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>MBS Dashboard</SheetTitle>
          </SheetHeader>
          <ul className="mt-12 space-y-2">
            {links.map((link) => {
              if (link.href === "/dashboard/staffs" && session.data?.user.role !== "admin")
                return null

              return (
                <li key={link.href}>
                  <Button
                    asChild
                    variant="ghost"
                    className={clsx(
                      "w-full justify-start",
                      path.endsWith(link.href) && "bg-secondary",
                    )}>
                    <Link href={link.href}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Nav
