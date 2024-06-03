import BookingsTable from "./BookingsTable"

import { fetchDashboardBookings } from "@/server-actions/booking"
import { redirect } from "next/navigation"

const Bookings = async ({
  searchParams,
}: {
  searchParams: { filter?: "all" | "paid" | "unpaid" }
}) => {
  if (searchParams.filter && !["all", "paid", "unpaid"].includes(searchParams.filter))
    redirect("/dashboard/bookings")

  const bookings = await fetchDashboardBookings(searchParams.filter || "all")

  return (
    <section className="p-4">
      <BookingsTable bookings={bookings} />
    </section>
  )
}

export default Bookings
