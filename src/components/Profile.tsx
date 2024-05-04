"use client"

import PlaceholderUser from "public/placeholder-user.webp"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, CircleUser, LogIn, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { signIn, signOut, useSession } from "next-auth/react"

const Profile = () => {
  const session = useSession()

  if (session.status === "loading") return <Skeleton className="h-10 w-10 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {session.status === "authenticated" ? (
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={"Photo of " + session.data?.user.username}
            />
            <AvatarFallback>{session.data?.user.username[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src={PlaceholderUser} alt="Unauthenticated User" fill />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {session.status === "authenticated" ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <CircleUser className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => signIn()}>
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile
