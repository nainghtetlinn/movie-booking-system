import BookingsTable from "./BookingsTable"

import db from "prisma/db"

const Bookings = async () => {
  const bookings = await db.booking.findMany({
    include: {
      tickets: {
        include: {
          seat: {
            select: {
              class: true,
              row: true,
              number: true,
            },
          },
          show: {
            include: {
              movie: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <section className="p-4">
      <BookingsTable bookings={bookings} />
    </section>
  )
}

export default Bookings
