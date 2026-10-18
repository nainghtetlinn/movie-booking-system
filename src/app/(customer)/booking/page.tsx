import TitleTypography from "@/components/TitleTypography"
import BookingForm from "./_components/BookingForm"

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getMovies, getSeats, getShows } from "@/server-actions/booking"

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ movieId?: string; showId?: string }>
}) => {
  const { movieId, showId } = await searchParams
  const qc = new QueryClient()

  await qc.prefetchQuery({ queryKey: ["movies"], queryFn: () => getMovies() })

  if (movieId) {
    await qc.prefetchQuery({
      queryKey: ["movie", movieId, "shows"],
      queryFn: () => getShows(movieId),
    })
  }

  if (showId) {
    await qc.prefetchQuery({
      queryKey: ["movie", movieId, "show", showId, "seats"],
      queryFn: () => getSeats(showId),
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
