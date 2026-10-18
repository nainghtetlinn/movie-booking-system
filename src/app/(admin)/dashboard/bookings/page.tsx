import BookingsTable from "./BookingsTable"

import { fetchDashboardBookings } from "@/server-actions/booking"
import { redirect } from "next/navigation"

const Bookings = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "all" | "paid" | "unpaid" }>
}) => {
  const { filter } = await searchParams
  if (filter && !["all", "paid", "unpaid"].includes(filter)) redirect("/dashboard/bookings")

  const bookings = await fetchDashboardBookings(filter || "all")

  return (
    <section className="p-4">
      <BookingsTable bookings={bookings} />
    </section>
  )
}

export default Bookings
