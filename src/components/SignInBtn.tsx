"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

const SignInBtn = () => {
  return <Button onClick={() => signIn()}>Sign in</Button>
}

export default SignInBtn
