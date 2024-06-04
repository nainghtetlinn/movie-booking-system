"use client"

import DarkModeBtn from "@/components/DarkModeBtn"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Headset, Menu, ShoppingCart, Ticket } from "lucide-react"
import Link from "next/link"
import Profile from "@/components/Profile"

import { useScrollDirection } from "@/hooks/useScrollDirection"
import clsx from "clsx"
import { usePathname } from "next/navigation"

const Nav = () => {
  const path = usePathname()
  const direction = useScrollDirection()

  return (
    <>
      <nav
        className={clsx(
          "sticky left-0 right-0 top-0 z-50 border-b bg-background transition-[padding] duration-500",
          direction == "up" && "py-4",
        )}>
        <div className="container flex items-center justify-between py-2">
          <h4 className="text-lg font-semibold">
            <Link href="/">Movie Booking System</Link>
          </h4>
          <div className="flex items-center space-x-4">
            <MobileMenu path={path} />
            <NavLinks path={path} />
            <DarkModeBtn />
            <Profile />
          </div>
        </div>
      </nav>
    </>
  )
}

const links = [
  { href: "/booking", title: "Booking", icon: Ticket },
  { href: "/contact", title: "Contact", icon: Headset },
  { href: "/tickets", title: "My tickets", icon: ShoppingCart },
]
const NavLinks = ({ path }: { path: string }) => {
  return (
    <>
      <ul className="hidden items-center space-x-6 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={clsx(
                "transition-colors hover:text-foreground/60 active:text-foreground/80",
                path == link.href && "text-foreground/80",
              )}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const MobileMenu = ({ path }: { path: string }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent side="bottom" align="end">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <DropdownMenuItem className={clsx(path == link.href && "bg-accent")}>
                  <link.icon className="mr-2 h-4 w-4" />
                  <span>{link.title}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </>
  )
}

export default Nav
