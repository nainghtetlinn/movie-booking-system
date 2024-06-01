"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

const Range = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  return (
    <ToggleGroup
      type="single"
      defaultValue={searchParams.get("range")?.toString()}
      onValueChange={(e) => {
        const params = new URLSearchParams(searchParams)
        if (e) {
          params.set("range", e)
        } else {
          params.delete("range")
        }
        replace(`${pathname}?${params.toString()}`)
      }}
      className="bg-background">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default Range
