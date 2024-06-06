# Movie booking system

Web based application for online booking.

## Features

- Booking without needed for an account
- Admin dashboard
- Role based permissions

## Demo

https://moviebookingsystem.vercel.app/

## Run Locally

Clone the project

```bash
  git clone https://github.com/nainghtetlinn/movie-booking-system.git
```

Go to the project directory

```bash
  cd movie-booking-system
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Start the email dev server

```bash
  npm run emaildev
```

Seeding data

```bash
  npm run seed
```

# Project Strucutre

```graphql
MOVIE_BOOKING_SYSTEM/
├── prisma/                 # Prisma folder for database schema and seed file
│   ├── schema.prisma       # Prisma database schema
│   └── schema.dbml         # Database markup language for schema
├── emails/                 # Email templates
├── src/                    # Source code directory
│   ├── app/
│   │   ├── (admin)/        # Admin routes group
│   │   │   ├── dashboard/
│   │   │   │   ├── bookings/
│   │   │   │   ├── movies/
│   │   │   │   ├── profile/
│   │   │   │   ├── shows/
│   │   │   │   └── staffs/
│   │   │   └── login/      # Admin login page
│   │   ├── (customer)/     # Customer routes group
│   │   │   ├── booking/
│   │   │   ├── contact/
│   │   │   ├── movies/
│   │   │   ├── success/
│   │   │   └── tickets/
│   │   └── api/            # Api routes
│   ├── components/         # Reusable components
│   │   └── ui/             # Shadcn UI components
│   ├── configs/            # Configs folder
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   ├── providers/          # React context providers
│   ├── server-actions/     # Server actions
│   ├── styles/             # CSS files
│   ├── types/              # Typescript types
│   ├── validators/         # Zod validation schemas
│   └── middleware
└── .env.example            # Example Environment variables
```

# Tech Stacks

```
Language
└── Typescript

CSS
├── Tailwind CSS
└── Shadcn UI

Backend
├── NextJs
├── Prisma
└── Posgresql

Others
├── Zod
├── Next auth
├── React hook form
├── React email
├── React query
└── React table
```
