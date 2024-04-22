import HeroImage from "public/hero-image.jpg"

import TitleTypography from "@/components/TitleTypography"
import MoviesCarousel from "./MoviesCarousel"

const Shows = () => {
  return (
    <>
      <section className="container mb-12">
        <TitleTypography>Shows</TitleTypography>
        <div>
          <MoviesCarousel
            options={{ startIndex: 2 }}
            movies={[
              {
                id: "m1",
                title: "Star War 1",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m2",
                title: "Star War 2",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m3",
                title: "Star War 3",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m4",
                title: "Star War 4",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m5",
                title: "Star War 5",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
            ]}
          />
        </div>
      </section>
    </>
  )
}

export default Shows
