"use client"

import { Badge } from "@/components/ui/badge"
import ActionsBtn from "./_components/ActionsBtn"

import { TStaffTableItem } from "@/types/staff"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<TStaffTableItem>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge className="capitalize">{row.getValue("role")}</Badge>,
  },
  {
    id: "bookings",
    accessorKey: "_count.bookings",
    header: "Bookings",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.getValue("role") === "admin") return null
      return <ActionsBtn staff={row.original} />
    },
  },
]
