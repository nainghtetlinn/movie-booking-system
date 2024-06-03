"use client"

import Filter from "@/components/Filter"
import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useTable } from "@/hooks/useTable"
import { TBookingTableItem } from "@/types/booking"
import { columns } from "./columns"

const BookingsTable = ({ bookings }: { bookings: TBookingTableItem[] }) => {
  const table = useTable({ data: bookings, columns })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Filter searchParamKey="filter" defaultOptions="all" options={["all", "paid", "unpaid"]} />
        <div className="space-x-2">
          <ToggleTableViewBtn table={table} />
        </div>
      </div>
      <Table
        title="Bookings"
        description="List of bookings"
        columnsLength={columns.length}
        table={table}
      />
    </>
  )
}

export default BookingsTable
