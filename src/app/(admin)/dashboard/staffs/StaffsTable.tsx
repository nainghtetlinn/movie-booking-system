"use client"

import Filter from "@/components/Filter"
import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import CreateStaffBtn from "./_components/CreateStaffBtn"

import { useTable } from "@/hooks/useTable"
import { TStaffTableItem } from "@/types/staff"
import { columns } from "./columns"

const StaffsTable = ({ staffs }: { staffs: TStaffTableItem[] }) => {
  const table = useTable({ data: staffs, columns })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Filter searchParamKey="filter" defaultOptions="all" options={["all", "admin", "staff"]} />
        <div className="space-x-2">
          <ToggleTableViewBtn table={table} />
          <CreateStaffBtn />
        </div>
      </div>
      <Table
        title="Staffs"
        description="Manage your staffs."
        columnsLength={columns.length}
        table={table}
      />
    </>
  )
}

export default StaffsTable
