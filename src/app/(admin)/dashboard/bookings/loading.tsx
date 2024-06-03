import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <Loader2 className="mr-2 h-12 w-12 animate-spin" />
    </section>
  )
}

export default Loading
