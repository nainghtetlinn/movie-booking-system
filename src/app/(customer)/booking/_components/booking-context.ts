import { createContext } from "react"

type BookingContextProps = {
  goNext: () => void
  goPrev: () => void
}

const BookingContext = createContext<BookingContextProps | null>(null)

export default BookingContext
