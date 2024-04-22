import HeroImage from "public/hero-image.jpg"

import Image from "next/image"
import TitleTypography from "@/components/TitleTypography"

const NowPlayingMovie = () => {
  return (
    <>
      <section className="container mb-12">
        <TitleTypography>Now Playing</TitleTypography>
        <div className="grid overflow-hidden rounded-lg bg-secondary lg:grid-cols-2">
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-lg">
              <h5 className="mb-4 text-2xl font-bold">Harry Potter</h5>
              <p>1 Hr 50 Min</p>
              <p>Released Apr 12,2024</p>
              <p>11:00am - 1:00pm</p>
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden">
            <Image
              src={HeroImage}
              alt="Current Showing Movie"
              quality={100}
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default NowPlayingMovie
