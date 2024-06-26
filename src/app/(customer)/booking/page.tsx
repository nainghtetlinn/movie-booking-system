import TitleTypography from "@/components/TitleTypography"
import BookingForm from "./_components/BookingForm"

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getMovies, getSeats, getShows } from "@/server-actions/booking"

const BookingPage = async ({
  searchParams,
}: {
  searchParams: { movieId?: string; showId?: string }
}) => {
  const qc = new QueryClient()

  await qc.prefetchQuery({ queryKey: ["movies"], queryFn: () => getMovies() })

  if (searchParams.movieId) {
    await qc.prefetchQuery({
      queryKey: ["movie", searchParams.movieId, "shows"],
      queryFn: () => getShows(searchParams.movieId!),
    })
  }

  if (searchParams.showId) {
    await qc.prefetchQuery({
      queryKey: ["movie", searchParams.movieId, "show", searchParams.showId, "seats"],
      queryFn: () => getSeats(searchParams.showId!),
    })
  }

  return (
    <>
      <main className="container min-h-[80vh]">
        <TitleTypography>Booking</TitleTypography>
        <HydrationBoundary state={dehydrate(qc)}>
          <BookingForm />
        </HydrationBoundary>
      </main>
    </>
  )
}

export default BookingPage
