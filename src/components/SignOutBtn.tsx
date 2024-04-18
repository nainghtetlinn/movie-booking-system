"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

const SignOutBtn = () => {
  return <Button onClick={() => signOut()}>Sign out</Button>
}

export default SignOutBtn
