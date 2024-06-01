"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

const Filter = ({
  searchParamKey,
  defaultOptions,
  options,
}: {
  searchParamKey: string
  defaultOptions: string
  options: string[]
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [selected, setSelected] = useState<string>(
    searchParams.get(searchParamKey) || defaultOptions,
  )

  return (
    <ToggleGroup
      type="single"
      value={selected}
      onValueChange={(e) => {
        if (!e) return
        setSelected(e)
        const params = new URLSearchParams(searchParams)
        params.set(searchParamKey, e)
        replace(`${pathname}?${params.toString()}`)
      }}>
      {options.map((o, i) => (
        <ToggleGroupItem key={i} value={o} className="capitalize">
          {o}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default Filter
