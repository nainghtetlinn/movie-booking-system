import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PayBtn from "./_components/PayBtn"

import { formatShowTime } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import db from "prisma/db"

const SuccessPage = async ({ searchParams }: { searchParams: { bookingId?: string } }) => {
  if (!searchParams.bookingId) {
    redirect("/booking")
  }

  const booking = await db.booking.findUnique({
    where: { id: searchParams.bookingId },
    include: { tickets: { include: { seat: true, show: { include: { movie: true } } } } },
  })

  if (!booking) {
    redirect("/booking")
  }

  if (booking.status === "unpaid") {
    return (
      <main className="container py-12">
        <h1 className="text-center text-3xl font-bold">Thank You!!!</h1>
        <h2 className="mt-4 text-center text-lg">Your Booking Have Successful!</h2>

        <Card className="mx-auto my-8 max-w-[700px]">
          <CardHeader>
            <CardTitle>
              ID: <span className="text-primary">{booking.id}</span>
            </CardTitle>
            <CardTitle>
              Status: <span className="text-primary">{booking.status}</span>
            </CardTitle>
            <CardDescription>{booking.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booking.tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      {ticket.seat.row}
                      {ticket.seat.number}
                    </TableCell>
                    <TableCell>{ticket.show.movie.title}</TableCell>
                    <TableCell>
                      {formatShowTime(ticket.show.date, ticket.show.startTime, ticket.show.endTime)}
                    </TableCell>
                    <TableCell>{ticket.amount.toLocaleString()} Ks</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>{booking.totalAmount.toLocaleString()} Ks</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <PayBtn id={booking.id} />
        </div>
        <p className="mt-4 rounded-lg border border-yellow-600 bg-yellow-400/30 p-8 text-center">
          Booking will be automatically cancelled if it was not paid within 1 hour.
        </p>
      </main>
    )
  } else
    return (
      <main className="container py-12">
        <h1 className="text-center text-3xl font-bold">Success!!!</h1>
        <h2 className="mt-4 text-center text-lg">We have sent booking details to your email!</h2>

        <div className="mt-4 flex justify-center">
          <Button asChild variant="link">
            <Link href="/tickets">See your tickets here.</Link>
          </Button>
        </div>
      </main>
    )
}

export default SuccessPage
