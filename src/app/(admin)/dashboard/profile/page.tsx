import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/configs/auth"

const Profile = async () => {
  const session = await getServerSession(authOptions)

  return (
    <section className="p-4">
      <h2 className="text-3xl font-bold">Profile</h2>

      <Avatar className="my-4 h-28 w-28 text-4xl">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt={"Photo of " + session?.user.username}
        />
        <AvatarFallback>{session?.user.username[0]}</AvatarFallback>
      </Avatar>

      <h4>Name: {session?.user.username}</h4>
      <h4>Id: {session?.user.id}</h4>
      <h4>Role: {session?.user.role}</h4>
    </section>
  )
}

export default Profile
