import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const hourString = hours > 0 ? `${hours} Hr` : ""
  const minuteString = remainingMinutes > 0 ? ` ${remainingMinutes} Min` : ""
  return hourString + minuteString
}
