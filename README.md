# Movie booking system

Web based application for online booking.

# Project Strucutre

```graphql
MOVIE_BOOKING_SYSTEM/
├── src/prisma/             # Prisma folder for database schema and migrations
│   └── schema.prisma       # Define your database schema here
├── src/                    # Source code directory
│   ├── components/         # Reusable components
│   │    └── ui/            # Shadcn UI components
│   ├── containers/         # Page level components(Option)
│   ├── utils/              # Utility functions
│   └── app/                # Next.js app folder
│          api/             # API routes folder
│          controllers/     # Controllers folder
└── .env.example            # Example Environment variables
```

# Tech Stacks

```
Frontend
  Tailwind CSS
  Shadcn UI

Backend
  NextJs
  Prisma
  Posgresql
```
