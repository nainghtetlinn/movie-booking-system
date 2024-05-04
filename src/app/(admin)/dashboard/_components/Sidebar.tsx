"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clapperboard, Film, Home, Menu, Ticket, Users, X } from "lucide-react"

import clsx from "clsx"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const Sidebar = () => {
  const path = usePathname()
  const session = useSession()
  const [open, setOpen] = useState(false)

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <aside className="hidden border bg-background sm:block">
          <nav className="p-2">
            <ul
              className={clsx(
                "flex flex-col space-y-2 overflow-hidden transition-all duration-500",
                open ? "w-48" : "w-10",
              )}>
              <li>
                <Button variant="outline" size="icon" onClick={() => setOpen(!open)}>
                  {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </li>
              {links.map((link) => {
                if (link.href === "/dashboard/staffs" && session.data?.user.role !== "admin")
                  return null

                return (
                  <li key={link.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className={clsx(
                            "w-full justify-start overflow-hidden p-0",
                            path.endsWith(link.href) && "bg-secondary",
                          )}>
                          <Link href={link.href}>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                              <link.icon className="h-4 w-4" />
                            </span>
                            <span>{link.title}</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={clsx(open && "hidden")}>
                        {link.title}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
      </TooltipProvider>
    </>
  )
}

const links = [
  { href: "/dashboard", title: "Dashboard", icon: Home },
  { href: "/dashboard/movies", title: "Movies", icon: Film },
  { href: "/dashboard/shows", title: "Shows", icon: Clapperboard },
  { href: "/dashboard/tickets", title: "Tickets", icon: Ticket },
  { href: "/dashboard/staffs", title: "Staffs", icon: Users },
]

export default Sidebar
