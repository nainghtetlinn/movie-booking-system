import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"
import { PrismaClient, Prisma } from "@prisma/client"

const db = new PrismaClient()

const seedUser = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10)
  console.log("Seeding user ... ")
  await db.user.create({
    data: {
      username: process.env.ADMIN_USERNAME!,
      role: "admin",
      password: hashedPassword,
    },
  })
}

const seedMovie = async () => {
  console.log("Seeding movies ... ")
  const movieTitles: string[] = []
  const movies: Prisma.MovieCreateManyInput[] = []
  for (let i = 0; i < 5; i++) {
    let title = faker.music.songName()
    while (movieTitles.includes(title)) {
      title = faker.music.songName()
    }
    movieTitles.push(title)
    movies.push({
      title,
      description: faker.commerce.productDescription(),
      posterUrl: process.env.MOVIE_POSTER_SEED!,
      genre: faker.music.genre(),
      durationInMins: faker.number.int({ min: 30, max: 150 }),
      releaseDate: new Date(faker.date.soon({ days: 7 }).setHours(0, 0, 0, 0)),
    })
  }
  await db.movie.createMany({ data: movies })
}

const seedShow = async () => {
  console.log("Seeding shows ... ")
  const shows: Prisma.ShowCreateManyInput[] = []
  const showSeatRelations: Prisma.ShowSeatRelationCreateManyInput[] = []

  const movies = await db.movie.findMany()
  movies.forEach(async (movie) => {
    for (let i = 0; i < 5; i++) {
      const showDate = faker.date.soon({ days: 7, refDate: movie.releaseDate })
      showDate.setHours(0, 0, 0, 0)
      const startTime = new Date(new Date(showDate).setHours(faker.number.int({ min: 8, max: 16 })))
      const endTime = new Date(new Date(startTime).setHours(startTime.getHours() + 2))
      shows.push({ movieId: movie.id, date: showDate, startTime, endTime })
    }
  })
  await db.show.createMany({ data: shows })
  const createdShows = await db.show.findMany()
  const seats = await db.seat.findMany()
  createdShows.forEach((s) => {
    seats.forEach((seat) => {
      showSeatRelations.push({ showId: s.id, seatId: seat.id })
    })
  })
  await db.showSeatRelation.createMany({ data: showSeatRelations })
}

const seedSeat = async () => {
  console.log("Seeding seats ... ")
  const rows = "ABCDEF"
  const seats: Prisma.SeatCreateManyInput[] = []
  for (let i = 0; i < 6; i++) {
    let seatClass = "front"
    let price = 3000
    if (i == 2 || i == 3) {
      seatClass = "mid"
      price = 5000
    }
    if (i == 4 || i == 5) {
      seatClass = "vip"
      price = 7000
    }
    for (let j = 1; j <= 10; j++) {
      seats.push({
        class: seatClass,
        row: rows[i],
        number: j,
        price,
      })
    }
  }
  await db.seat.createMany({ data: seats })
}

const seedBookingsAndTickets = async () => {
  console.log("Seeding bookings and tickets ... ")
  const bookings: Prisma.BookingCreateManyInput[] = []
  const tickets: Prisma.TicketCreateManyInput[] = []

  for (let i = 0; i < 5; i++) {
    bookings.push({ totalAmount: 0, email: process.env.CUSTOMER_EMAIL_SEED! })
  }
  await db.booking.createMany({ data: bookings })

  const dbBookings = await db.booking.findMany()
  const shows = await db.show.findMany()
  const showIds = shows.map((id) => id.id)
  const showSeats = await db.showSeatRelation.findMany({
    where: { showId: { in: showIds } },
    include: {
      seat: {
        select: {
          price: true,
        },
      },
    },
  })

  dbBookings.forEach(async (booking) => {
    let totalAmount = 0
    const showId = showIds[faker.number.int({ min: 0, max: showIds.length - 1 })]

    for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
      let showSeat = showSeats[faker.number.int({ min: 0, max: showSeats.length - 1 })]
      while (showSeat.status === "purchased") {
        showSeat = showSeats[faker.number.int({ min: 0, max: showSeats.length - 1 })]
      }
      tickets.push({
        bookingId: booking.id,
        showId,
        seatId: showSeat.seatId,
        amount: showSeat.seat.price,
      })
      totalAmount += showSeat.seat.price
    }

    await db.booking.update({ where: { id: booking.id }, data: { totalAmount } })
  })

  await db.ticket.createMany({ data: tickets })

  const dbTickets = await db.ticket.findMany()
  dbTickets.forEach(async (t) => {
    const { seatId, showId } = t
    await db.showSeatRelation.updateMany({
      where: {
        seatId,
        showId,
      },
      data: {
        status: "purchased",
      },
    })
  })
}

const main = async () => {
  console.log("Cleaning database ... ")
  await db.user.deleteMany()
  await db.showSeatRelation.deleteMany()
  await db.ticket.deleteMany()
  await db.seat.deleteMany()
  await db.booking.deleteMany()
  await db.show.deleteMany()
  await db.movie.deleteMany()

  await seedUser()
  await seedMovie()
  await seedSeat()
  await seedShow()
  await seedBookingsAndTickets()
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
