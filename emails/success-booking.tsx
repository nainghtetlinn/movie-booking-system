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
  Img,
} from "@react-email/components"

import { formatShowTime } from "@/lib/utils"
import { Prisma } from "@prisma/client"

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

const SuccessBooking = ({ booking }: { booking: Booking }) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="my-8 bg-white font-sans">
          <Container className="mx-auto rounded-lg p-4 shadow-lg">
            <Heading>Movie Booking System</Heading>
            <Text className="text-lg text-gray-700">Booking success! Happy Watching!</Text>
            <Section>
              <Row>
                <Column>
                  <Text className="text-lg font-bold">Booking ID</Text>
                  <Text className="text-lg">{booking?.id}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-lg font-bold">Movie</Text>
                  <Text className="text-lg">{booking?.tickets[0].show.movie.title}</Text>
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
                    {booking &&
                      formatShowTime(
                        booking?.tickets[0].show.date,
                        booking?.tickets[0].show.startTime,
                        booking?.tickets[0].show.endTime,
                      )}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-lg font-bold">Seats</Text>
                  <Text className="text-lg">
                    {booking?.tickets.map((t) => `${t.seat.row}${t.seat.number}`).join(", ")}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-lg font-bold">Total Amount</Text>
                  <Text className="text-lg">{booking?.totalAmount.toLocaleString()} Ks</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-lg font-bold">Status</Text>
                  <Text className="text-lg">{booking?.status.toUpperCase()}</Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default SuccessBooking
