import {
  Html,
  Head,
  Tailwind,
  Body,
  Text,
  Heading,
  Container,
  Section,
  Row,
  Column,
  Hr,
  Img,
  Link,
} from "@react-email/components"

import { Prisma } from "@prisma/client"
import { formatShowTime } from "@/lib/utils"

type Booking = Prisma.BookingGetPayload<{
  include: {
    tickets: {
      include: {
        seat: true
        show: {
          include: {
            movie: true
          }
        }
      }
    }
  }
}>

const baseUrl = process.env.NEXTAUTH_URL!

const ListBookings = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="my-8 bg-white font-sans">
          <Container className="mx-auto rounded-lg p-4 shadow-lg">
            <Heading>Movie Booking System</Heading>
            <Text className="text-lg text-gray-700">
              Here is your bookings list. Happy Watching!
            </Text>
            {bookings?.map((booking) => (
              <Section key={booking.id}>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Booking ID</Text>
                    <Text className="text-lg">{booking.id}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Movie</Text>
                    <Text className="text-lg">{booking.tickets[0].show.movie.title}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Poster</Text>
                    <Img
                      src={booking.tickets[0].show.movie.posterUrl}
                      alt={booking.tickets[0].show.movie.title}
                      width="100"
                      height="200"
                      style={{ objectFit: "cover" }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Show</Text>
                    <Text className="text-lg">
                      {formatShowTime(
                        booking.tickets[0].show.date,
                        booking.tickets[0].show.startTime,
                        booking.tickets[0].show.endTime,
                      )}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Seats</Text>
                    <Text className="text-lg">
                      {booking.tickets.map((t) => `${t.seat.row}${t.seat.number}`).join(", ")}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Total Amount</Text>
                    <Text className="text-lg">{booking.totalAmount.toLocaleString()} Ks</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-lg font-bold">Status</Text>
                    <Text className="text-lg">{booking.status.toUpperCase()}</Text>
                  </Column>
                  {booking.status === "unpaid" && (
                    <Column>
                      <Link
                        className="text-lg font-bold"
                        href={`${baseUrl}/success?bookingId=${booking.id}`}>
                        Make a payment.
                      </Link>
                    </Column>
                  )}
                </Row>
                <Hr />
              </Section>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ListBookings
