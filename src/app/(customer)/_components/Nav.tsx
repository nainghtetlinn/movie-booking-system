"use client"

import { Menu, Ticket, Headset, ShoppingCart, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useScrollDirection } from "@/hooks/useScrollDirection"

const Nav = () => {
  const path = usePathname()
  const direction = useScrollDirection()

  return (
    <>
      <nav
        className={clsx(
          "sticky left-0 right-0 top-0 border-b bg-background transition-[padding] duration-500",
          direction == "up" && "py-4",
        )}>
        <div className="container flex items-center justify-between py-2">
          <h4 className="text-lg font-semibold">Movie Booking System</h4>
          <div className="flex items-center space-x-4">
            <DarkModeBtn />
            <MobileMenu path={path} />
            <NavLinks path={path} />
          </div>
        </div>
      </nav>
    </>
  )
}

const themeModes = ["light", "dark", "system"]
const DarkModeBtn = () => {
  const { setTheme, theme } = useTheme()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent side="bottom" align="end">
            {themeModes.map((mode) => (
              <DropdownMenuItem
                key={mode}
                className={clsx("capitalize", mode == theme && "bg-accent")}
                onClick={() => setTheme(mode)}>
                {mode}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
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
