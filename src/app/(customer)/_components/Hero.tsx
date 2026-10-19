import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Play, Popcorn } from "lucide-react"

const Hero = () => {
  return (
    <>
      <section className="relative mb-16 h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <span className="sr-only">Background Image</span>
          <Image
            src={"/hero-image.jpg"}
            alt="Hero Image"
            fill
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-black/30" />
        </div>

        <div className="relative container flex h-full items-end pb-24 sm:items-center sm:pb-0">
          <div className="max-w-2xl space-y-4 text-white">
            <p className="text-primary text-sm font-medium tracking-widest uppercase">
              <Popcorn className="mr-2 inline-block h-4 w-4" />
              Your cinema, your seats, your time
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Movie Booking
              <span className="text-primary block">System</span>
            </h1>
            <p className="max-w-lg text-base text-white/70 md:text-lg">
              Browse the latest movies, pick your perfect seats, and book tickets — all in just a
              few clicks.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button size="lg" asChild>
                <Link href="/booking">
                  <Play className="mr-2 h-4 w-4" />
                  Book Now
                </Link>
              </Button>
              <Button size="lg" variant={"secondary"} asChild>
                <Link href="#movies">Browse Movies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
