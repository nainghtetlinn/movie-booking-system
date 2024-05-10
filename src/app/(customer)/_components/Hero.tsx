import HeroImage from "public/hero-image.jpg"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const Hero = () => {
  return (
    <>
      <section className="relative mb-12 h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <span className="sr-only">Background Image</span>
          <Image src={HeroImage} alt="Hero Image" priority className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90"></div>
        </div>

        <div className="container relative flex h-full items-center">
          <div className="space-y-2 text-white">
            <h3 className="text-3xl font-bold md:text-5xl">Movie Booking System</h3>
            <p className="md:text-xl">Web based application for online booking.</p>
            <div className="pt-4">
              <Button asChild>
                <Link href="/booking">Booking</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
