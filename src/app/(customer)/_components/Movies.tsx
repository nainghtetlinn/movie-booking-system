import HeroImage from "public/hero-image.jpg"

import TitleTypography from "@/components/TitleTypography"
import MoviesCarousel from "./MoviesCarousel"

const Movies = () => {
  return (
    <>
      <section className="container mb-12">
        <TitleTypography>Movies</TitleTypography>
        <div>
          <MoviesCarousel
            movies={[
              {
                id: "m1",
                title: "Harry Potter 1",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m2",
                title: "Harry Potter 2",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m3",
                title: "Harry Potter 3",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m4",
                title: "Harry Potter 4",
                duration: "1 Hr 50 Min",
                released: "Mar 12,2024",
                image: HeroImage,
              },
              {
                id: "m5",
                title: "Harry Potter 5",
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

export default Movies
