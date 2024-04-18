import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/auth"

import SignInBtn from "@/components/SignInBtn"
import SignOutBtn from "@/components/SignOutBtn"

export default async function Home() {
  const user = await getServerSession(authOptions)

  return (
    <>
      <main>{!!user ? "Sign In" : "Sign Out"}</main>
      <div>{JSON.stringify(user)}</div>
      <SignInBtn />
      <SignOutBtn />
    </>
  )
}
